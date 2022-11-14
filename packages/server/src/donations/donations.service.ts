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
import {
  SochainService,
  Transaction,
  TxReceived,
} from './../sochain/sochain.service';
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
  myDogeAddress = 'D8HjKf37rF3Ho7tjwe17MPN8xQ2UbHSUhB';
  soDogeTipAddress = 'D7XihpaUjiCqvPrky2xEyfvgoJeUjMKQ6E';
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
    this.syncAllEthereumTransfers();
    this.syncAllDogeDonations();
    // @next -- DEBUG THIS IS NOT WORKING FOR SOME REASON
    // listen to transfers realtime
    // this.listenForNewEthereumDonations();
  }

  async syncAllDogeDonations() {
    await this.syncAllDogeDonationsForAddress(this.myDogeAddress);
    await this.syncAllDogeDonationsForAddress(this.soDogeTipAddress);
  }

  async syncRecentDogeDonations() {
    this.syncMostRecentDogeDonationsForAddress(this.myDogeAddress);
    this.syncMostRecentDogeDonationsForAddress(this.soDogeTipAddress);
  }

  private async syncMostRecentDogeDonationsForAddress(address: string) {
    const mostRecentDonation =
      await this.donationsRepo.getMostRecentDogeDonationForAddress(address);
    try {
      if (mostRecentDonation) {
        await this.syncDogeDonationsFromMostRecent(mostRecentDonation);
      } else {
        await this.syncAllDogeDonationsForAddress(address);
      }
    } catch (e) {
      this.logger.error(
        `Could not sync Doge donations for address: ${address}`,
      );
      this.sentryClient.instance().captureException(e);
    }
  }

  private async syncDogeDonationsFromMostRecent(donation: Donations) {
    this.logger.log(
      `Syncing dogecoin donations from block number ${donation.blockNumber} : hash ${donation.txHash}`,
    );
    // check if there are any new txs past our most recent synced tx
    const donations = await this.sochain.getAllTxsReceivedToAddress(
      donation.toAddress,
      donation.txHash,
    );
    await this.upsertDogeDonations(donations, donation.toAddress);
  }

  async syncAllDogeDonationsForAddress(address: string) {
    this.logger.log(`Syncing all dogecoin donations for address: ${address}`);
    const receivedTxs = await this.sochain.getAllTxsReceivedToAddress(address);
    await this.upsertDogeDonations(receivedTxs, address);
  }

  private async upsertDogeDonations(
    receivedTxs: TxReceived[],
    toAddress: string,
  ) {
    for (const receivedTx of receivedTxs) {
      try {
        const tx: Transaction = await this.sochain.sleepAndTryAgain(
          () => this.sochain.getTransaction(receivedTx.txid),
          2,
        );

        const fromAddress = tx.inputs[0].address;
        await this.donationsRepo.upsert({
          fromAddress,
          toAddress,
          blockNumber: tx.block_no,
          blockCreatedAt: new Date(receivedTx.time * 1000),
          blockchain: ChainName.DOGECOIN,
          currency: DOGE_CURRENCY_SYMBOL,
          txHash: tx.txid,
          amount: Number(receivedTx.value),
        });
      } catch (e) {
        this.logger.error(e);
        this.logger.error(`could not sync doge coin tx: ${receivedTx.txid}`);
      }
    }
  }

  listenForNewEthereumDonations() {
    this.alchemy.listenForTransfersToAddress(this.ethereumAddress, (args) =>
      this.onNewTransfer(args),
    );
  }

  private onNewTransfer(args: any) {
    this.logger.log(`NEW TX HIT: ${JSON.stringify(args)}}`);
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
      throw new Error("There is paging data and we don't support currently");
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
    const myDogeBalance = await this.sochain.getBalance(this.myDogeAddress);
    const soDogeBalance = await this.sochain.getBalance(this.soDogeTipAddress);
    const totalBalance = myDogeBalance + soDogeBalance;
    const dogePrice = await this.coingecko.getDogePrice();
    return {
      symbol: DOGE_CURRENCY_SYMBOL,
      amount: totalBalance,
      usdNotional: totalBalance * dogePrice,
      usdPrice: dogePrice,
    };
  }

  async getDonations() {
    return this.donationsRepo.findMany({
      orderBy: {
        blockCreatedAt: 'desc',
      },
      where: {
        fromAddress: {
          notIn: [this.myDogeAddress, this.soDogeTipAddress],
        },
      },
    });
  }
}
