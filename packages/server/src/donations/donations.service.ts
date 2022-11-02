import { Injectable, Logger } from '@nestjs/common';
import { ChainName, Donations } from '@prisma/client';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import {
  AssetTransfersCategory,
  AssetTransfersOrder,
  AssetTransfersWithMetadataResult,
} from 'alchemy-sdk';
import { ethers } from 'ethers';
import { AlchemyService } from '../alchemy/alchemy.service';
import { CoinGeckoService } from './../coin-gecko/coin-gecko.service';
import { SochainService } from './../sochain/sochain.service';
import {
  DOGE_CURRENCY_SYMBOL,
  DonationsRepository,
  ETH_CURRENCY_SYMBOL,
} from './donations.repository';

export interface Balance {
  symbol: string;
  amount: number;
  usdNotional: number;
  usdPrice: number;
}

@Injectable()
export class DonationsService {
  private logger = new Logger(DonationsService.name);
  dogeCoinAddress = 'D8HjKf37rF3Ho7tjwe17MPN8xQ2UbHSUhB';
  ethereumAddress = '0x633aC73fB70247257E0c3A1142278235aFa358ac';

  constructor(
    private readonly alchemy: AlchemyService,
    private readonly donationsRepo: DonationsRepository,
    private readonly sochain: SochainService,
    private readonly coingecko: CoinGeckoService,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  init() {
    this.logger.log('💸 Donation service init');
    this.syncRecentEthereumDonations();
    this.syncRecentDogeDonations();
    // @next -- listen to transfers realtime
    // this.listenForNewDonations()
  }

  async syncRecentDogeDonations() {
    const mostRecentDonation =
      await this.donationsRepo.getMostRecentDogeDonation();
    try {
      if (mostRecentDonation) {
        await this.syncDogeDonationsFromMostRecent(mostRecentDonation);
      } else {
        await this.syncAllDogeDonations();
      }
    } catch (e) {
      this.logger.error('Could not sync Doge donations');
      this.sentryClient.instance().captureException(e);
    }
  }

  private async syncDogeDonationsFromMostRecent(donation: Donations) {
    this.logger.log(
      `Syncing dogecoin donations from block number ${donation.blockNumber} : hash ${donation.txHash}`,
    );
    // check if there are any new txs past our most recent synced tx
    const donations = await this.sochain.getTxsReceived(
      this.dogeCoinAddress,
      donation.txHash,
    );

    if (donations.length > 0) {
      await this.syncAllDogeDonations();
    }
  }

  async syncAllDogeDonations() {
    this.logger.log('Syning all dogecoin donations');
    const txs = await this.sochain.getAllNonChangeReceives(
      this.dogeCoinAddress,
    );
    await this.upsertDogeDonations(txs);
  }

  private async upsertDogeDonations(donations: any[]) {
    for (const donation of donations) {
      const fromAddress = donation?.incoming.inputs.filter(
        (input) => input.input_no === 0,
      )?.[0]?.address;
      const donationToUpsert = {
        txHash: donation.txid,
        blockNumber: donation.block_no,
        toAddress: this.dogeCoinAddress,
        blockchain: ChainName.DOGECOIN,
        currency: DOGE_CURRENCY_SYMBOL,
        amount: Number(donation.incoming.value),
        blockCreatedAt: new Date(donation.time * 1000),
        fromAddress,
      };
      try {
        await this.donationsRepo.upsert(donationToUpsert);
      } catch (e) {
        const errorMessage = `Could not upsert doge tx: ${
          donation.txid
        }\n\n${JSON.stringify(donationToUpsert)}`;
        this.logger.error(errorMessage);
        this.sentryClient.instance().captureMessage(errorMessage);
      }
    }
  }

  async syncRecentEthereumDonations() {
    const donation = await this.donationsRepo.getMostRecentEthereumDonation();
    try {
      if (donation) {
        this.logger.log(
          `Syncing ethereum transfers from block: ${donation.blockNumber}`,
        );

        await this.syncEthereumTransfersFromBlock(donation.blockNumber);
      } else {
        this.logger.log('Syncing all ethereum transfers');

        await this.syncAllEthereumTransfers();
      }
    } catch (e) {
      this.logger.error('Could not sync ethereum transfers');
      this.logger.error(e);
      this.sentryClient.instance().captureException(e);
    }
  }

  private async syncEthereumTransfersFromBlock(blockNumber: number) {
    const transfers = await this.getEthereumTransfers(
      ethers.BigNumber.from(blockNumber).toHexString(),
    );
    await this.upsertEthereumDonations(transfers);
  }

  async syncAllEthereumTransfers() {
    const transfers = await this.getEthereumTransfers();
    await this.upsertEthereumDonations(transfers);
  }

  private async getEthereumTransfers(fromBlock?: string) {
    const data = await this.alchemy.getAssetTransfers({
      order: AssetTransfersOrder.ASCENDING,
      toAddress: this.ethereumAddress,
      category: [AssetTransfersCategory.ERC20, AssetTransfersCategory.EXTERNAL],
      maxCount: 1000,
      withMetadata: true,
      fromBlock,
    });
    if (data.pageKey) {
      throw new Error("There is paging data and we don't support currentl");
    }
    return data?.transfers;
  }

  private async upsertEthereumDonations(
    transfers: AssetTransfersWithMetadataResult[],
  ) {
    for (const transfer of transfers) {
      await this.donationsRepo.upsert({
        blockchain: ChainName.ETHEREUM,
        blockCreatedAt: new Date(transfer.metadata.blockTimestamp),
        currency: transfer.asset,
        amount: transfer.value,
        blockNumber: ethers.BigNumber.from(transfer.blockNum).toNumber(),
        txHash: transfer.hash,
        fromAddress: ethers.utils.getAddress(transfer.from),
        toAddress: ethers.utils.getAddress(transfer.to),
        currencyContractAddress: transfer.rawContract.address
          ? ethers.utils.getAddress(transfer.rawContract.address)
          : null,
      });
    }
  }

  async getEthereumBalances(): Promise<Balance[]> {
    const balances: Balance[] = [];

    const eth = await this.alchemy.getBalance(this.ethereumAddress);
    const usdPrice = await this.coingecko.getETHPrice();
    const amount = Number(ethers.utils.formatEther(ethers.BigNumber.from(eth)));
    const usdNotional = usdPrice * amount;

    balances.push({
      symbol: ETH_CURRENCY_SYMBOL,
      usdPrice,
      usdNotional,
      amount,
    });

    const erc20 = await this.alchemy.getTokenBalances(this.ethereumAddress);
    for (const balance of erc20?.tokenBalances) {
      const metadata = await this.alchemy.getTokenMetadata(
        balance.contractAddress,
      );
      const symbol = metadata.symbol;
      const decimals = metadata.decimals;
      const amount = ethers.BigNumber.from(balance.tokenBalance)
        .div(ethers.BigNumber.from(10).pow(decimals))
        .toNumber();
      const usdPrice = await this.coingecko.getPriceByEthereumContractAddress(
        balance.contractAddress,
      );
      const usdNotional = usdPrice * amount;
      balances.push({
        symbol,
        usdPrice,
        usdNotional,
        amount,
      });
    }
    return balances;
  }

  async getDogeBalances(): Promise<Balance> {
    const dogeBalance = await this.sochain.getBalance(this.dogeCoinAddress);
    const dogePrice = await this.coingecko.getDogePrice();
    return {
      symbol: DOGE_CURRENCY_SYMBOL,
      amount: dogeBalance,
      usdNotional: dogeBalance * dogePrice,
      usdPrice: dogePrice,
    };
  }
}
