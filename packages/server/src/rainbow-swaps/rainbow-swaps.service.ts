import { Injectable, Logger } from '@nestjs/common';
import { ClientSide, EthereumNetwork, RainbowSwaps } from '@prisma/client';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import {
  AssetTransfersCategory,
  AssetTransfersOrder,
  AssetTransfersWithMetadataResult,
  Network,
} from 'alchemy-sdk';
import { ethers } from 'ethers';
import { AlchemyService } from '../alchemy/alchemy.service';
import { CoinGeckoService } from '../coin-gecko/coin-gecko.service';
import { ETH_CURRENCY_SYMBOL } from '../donations/donations.repository';
import { Balance } from '../donations/donations.service';
import { EthersService } from '../ethers/ethers.service';
import { sleep } from '../helpers/sleep';
import { SupportedNetwork } from './../alchemy/alchemy.service';
import { RainbowSwapsRepository } from './rainbow-swaps.repository';

@Injectable()
export class RainbowSwapsService {
  private logger = new Logger(RainbowSwapsService.name);
  private routerContractAddress = '0x00000000009726632680FB29d3F7A9734E3010E2';

  constructor(
    private readonly alchemy: AlchemyService,
    private readonly ethers: EthersService,
    private readonly rainbowSwapRepo: RainbowSwapsRepository,
    private readonly coingecko: CoinGeckoService,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  init() {
    this.logger.log('🌈 Rainbow swap serivce');
    this.syncAllNetworks();
  }

  private getDbNetwork(network: SupportedNetwork) {
    let dbNetwork: EthereumNetwork = EthereumNetwork.MAINNET;
    if (network === Network.MATIC_MAINNET) {
      dbNetwork = EthereumNetwork.POLYGON;
    } else if (network === Network.ARB_MAINNET) {
      dbNetwork = EthereumNetwork.ARBITRUM;
    }
    return dbNetwork;
  }

  private getDOGAddress(network: SupportedNetwork) {
    if (network === Network.MATIC_MAINNET) {
      return '0xeEe3371B89FC43Ea970E908536Fcddd975135D8a';
    } else if (network === Network.ARB_MAINNET) {
      return '0x4425742F1EC8D98779690b5A3A6276Db85Ddc01A';
    }
    return '0xBAac2B4491727D78D2b78815144570b9f2Fe8899';
  }

  async syncAllNetworks() {
    this.logger.log('syncing all mainnet swaps');
    await this.syncAllDOGSwaps(Network.ETH_MAINNET);

    // SKIP OTHER NETWORKS FOR NOW AS ALCHEMY DOES NOT SUPPORT INTERNAL TRANSFERS WHICH MAKES ACCURATE TRACKING DIFFICULT

    // this.logger.log('syncing all arbitrum swaps');
    // await this.syncAllDOGSwaps(Network.ARB_MAINNET);
    // this.logger.log('syncing all matic swaps');
    // await this.syncAllDOGSwaps(Network.MATIC_MAINNET);
  }

  async syncRecentDOGSwapsForAllNetworks() {
    this.logger.log('syncing recent mainnet swaps');
    await this.syncRecentDOGSwaps(Network.ETH_MAINNET);
    // this.logger.log('syncing recent arbitrum swaps');
    // await this.syncRecentDOGSwaps(Network.ARB_MAINNET);
    // this.logger.log('syncing recent matic swaps');
    // await this.syncRecentDOGSwaps(Network.MATIC_MAINNET);
  }

  private async syncRecentDOGSwaps(network: SupportedNetwork) {
    this.logger.log('Syncing rainbow DOG swaps');
    const block = await this.rainbowSwapRepo.getMostRecentSwapBlockNumber(
      this.getDbNetwork(network),
    );
    try {
      if (block) {
        this.logger.log(`Syncing DOG swaps from block: ${block}`);

        await this.syncDOGSwapsFromBlock(block, network);
      } else {
        this.logger.log('Syncing all DOG swaps');

        await this.syncAllDOGSwaps(network);
      }
    } catch (e) {
      this.logger.error(`Error getting recent DOG swaps`);
      this.logger.error(e);
      this.sentryClient.instance().captureException(e);
    }
  }

  private async syncDOGSwapsFromBlock(
    blockNumber: number,
    network: SupportedNetwork,
  ) {
    const transfers = await this.getDOGTransfersToRouterFromBlock(
      ethers.BigNumber.from(blockNumber).toHexString(),
      network,
    );
    await this.upsertDOGSwaps(transfers, network);
  }

  async syncAllDOGSwaps(network: SupportedNetwork) {
    const transfers = await this.getAllDOGTransfersToRouter(network);
    this.upsertDOGSwaps(transfers, network);
  }

  // @next -- investigate if we should be listening to transfers on all networks or not
  private async getDOGTransfersToRouterFromBlock(
    fromBlock: string,
    network: SupportedNetwork = Network.ETH_MAINNET,
  ) {
    const data = await this.alchemy.getAssetTransfers(
      {
        order: AssetTransfersOrder.ASCENDING,
        toAddress: this.routerContractAddress,
        contractAddresses: [this.getDOGAddress(network)],
        withMetadata: true,
        category: [AssetTransfersCategory.ERC20],
        maxCount: 1000,
        fromBlock,
      },
      network,
    );
    if (data.pageKey) {
      throw new Error("There is paging data we don't handle currently");
    }
    return data?.transfers;
  }

  private async getAllDOGTransfersToRouter(network: SupportedNetwork) {
    // NOTE: this assumes there are not more than 1000 transfers
    // @next -- handle pageKey correctly
    const data = await this.alchemy.getAssetTransfers(
      {
        order: AssetTransfersOrder.ASCENDING,
        toAddress: this.routerContractAddress,
        contractAddresses: [this.getDOGAddress(network)],
        withMetadata: true,
        category: [AssetTransfersCategory.ERC20],
        maxCount: 1000,
      },
      network,
    );
    if (data.pageKey) {
      throw new Error("There is paging data we don't handle currently");
    }
    return data?.transfers;
  }

  private async getRouterTransfersByBlock(
    block: string,
    network: SupportedNetwork,
  ) {
    const category = [
      AssetTransfersCategory.ERC20,
      AssetTransfersCategory.EXTERNAL,
    ];
    if (network === Network.ETH_MAINNET) {
      category.push(AssetTransfersCategory.INTERNAL);
    }
    const toTxs = (
      await this.alchemy.getAssetTransfers(
        {
          order: AssetTransfersOrder.ASCENDING,
          toAddress: this.routerContractAddress,
          fromBlock: block,
          toBlock: block,
          withMetadata: true,
          category,
        },
        network,
      )
    ).transfers;
    const fromTxs = (
      await this.alchemy.getAssetTransfers(
        {
          order: AssetTransfersOrder.ASCENDING,
          fromAddress: this.routerContractAddress,
          fromBlock: block,
          toBlock: block,
          withMetadata: true,
          category,
        },
        network,
      )
    ).transfers;
    return toTxs.concat(fromTxs);
  }

  private async upsertDOGSwaps(
    transfers: AssetTransfersWithMetadataResult[],
    network: SupportedNetwork,
  ) {
    for (const transfer of transfers) {
      const blockNumber = ethers.BigNumber.from(transfer.blockNum);
      const allTransfers = (
        await this.getRouterTransfersByBlock(blockNumber.toHexString(), network)
      ).filter((tx) => tx.hash === transfer.hash);

      try {
        const order = this.getOrderFromAssetTransfers(allTransfers);
        await this.rainbowSwapRepo.upsert({
          ...order,
          network: this.getDbNetwork(network),
        });
      } catch (e) {
        this.logger.error(`Could not insert rainbow swap: ${transfer.hash}`);
        this.logger.error(e);
      }
      // make sure we don't make alchemy angry!
      await sleep(1);
    }
  }

  private getOrderFromAssetTransfers(
    trace: AssetTransfersWithMetadataResult[],
  ): Omit<RainbowSwaps, 'id' | 'insertedAt' | 'updatedAt' | 'network'> {
    const external = trace.filter(
      (tx) => tx.category === AssetTransfersCategory.EXTERNAL,
    );
    const internal = trace.filter(
      (tx) => tx.category === AssetTransfersCategory.INTERNAL,
    );
    const erc20 = trace.filter(
      (tx) => tx.category === AssetTransfersCategory.ERC20,
    );

    erc20.sort((a, b) => {
      // uniqueId is missing from the type for some reason
      // https://docs.alchemy.com/changelog/08262022-unique-ids-for-alchemy_getassettransfers
      // @ts-ignore
      const aLogNumber = Number(a.uniqueId.split(':')[2]);
      // @ts-ignore
      const bLogNumber = Number(b.uniqueId.split(':')[2]);
      if (aLogNumber < bLogNumber) {
        return -1;
      }
      return 1;
    });

    let soldOrder: AssetTransfersWithMetadataResult;
    let boughtOrder: AssetTransfersWithMetadataResult;

    // erc20 for erc20 swap
    if (external.length === 0 && internal.length === 0) {
      soldOrder = erc20[0];
      boughtOrder = erc20[erc20.length - 1];
    } else {
      // ETH transfer to OR from the contract
      const externalToContract = external.filter((tx) =>
        this.ethers.getIsAddressEqual(tx.to, this.routerContractAddress),
      );
      const internalFromContract = internal.filter((tx) =>
        this.ethers.getIsAddressEqual(tx.from, this.routerContractAddress),
      );

      if (externalToContract.length > 1 || internalFromContract.length > 1) {
        this.logger.error(
          'There are multiple external to contract & internal from contract calls -- not prepared to handle',
        );
        this.logger.error(
          `external to contract: ${JSON.stringify(externalToContract)}`,
        );
        this.logger.error(
          `internal from contract: ${JSON.stringify(internalFromContract)}`,
        );
        throw new Error("Shouldn't hit");
      }

      if (externalToContract.length > 0 && internalFromContract.length > 0) {
        soldOrder = externalToContract[0];
        boughtOrder = erc20[erc20.length - 1];
      } else if (externalToContract.length === 0) {
        boughtOrder = internalFromContract[0];
        soldOrder = erc20[0];
      } else {
        soldOrder = externalToContract[0];
        boughtOrder = erc20[erc20.length - 1];
      }
    }

    if (soldOrder.asset !== 'DOG' && boughtOrder.asset !== 'DOG') {
      throw new Error('One of these orders should be an order for DOG');
    }

    let clientSide,
      quoteCurrency,
      quoteAmount,
      baseAmount,
      baseCurrencyAddress,
      quoteCurrencyAddress;

    const baseCurrency = 'DOG';

    if (soldOrder.asset === 'DOG') {
      clientSide = ClientSide.SELL;
      quoteCurrency = boughtOrder.asset;
      quoteAmount = boughtOrder.value;
      quoteCurrencyAddress = boughtOrder.rawContract.address;
      baseAmount = soldOrder.value;
      baseCurrencyAddress = soldOrder.rawContract.address as string | null;
    } else {
      clientSide = ClientSide.BUY;
      quoteCurrency = soldOrder.asset;
      quoteCurrencyAddress = soldOrder.rawContract.address;
      quoteAmount = soldOrder.value;
      baseAmount = boughtOrder.value;
      baseCurrencyAddress = boughtOrder.rawContract.address as string | null;
    }

    let donatedCurrency;
    let donatedAmount;
    let donatedCurrencyAddress;

    // rainbow router takes 85 bips
    // profits are taken in ether & if ether is not traded then the input token
    // NOTE WE ASSUME THE ROUTER IS ALWAYS TAKING A PROFIT OF 85 BIPS -- WE ARE NOT CONFIRMING ON CHAIN
    const rainbowSpreadBips = 85;
    const rainbowSpreadPct = rainbowSpreadBips / 10000;
    if (clientSide === ClientSide.BUY) {
      donatedCurrency = quoteCurrency;
      donatedCurrencyAddress = quoteCurrencyAddress;
      donatedAmount = quoteAmount * rainbowSpreadPct;
    } else {
      if (quoteCurrency === ETH_CURRENCY_SYMBOL) {
        donatedCurrency = quoteCurrency;
        donatedCurrencyAddress = quoteCurrencyAddress;
        donatedAmount =
          (quoteAmount * rainbowSpreadPct) / (1 + rainbowSpreadPct);
      } else {
        donatedCurrency = baseCurrency;
        donatedCurrencyAddress = baseCurrencyAddress;
        donatedAmount = baseAmount * rainbowSpreadPct;
      }
    }

    const blockCreatedAt = new Date(boughtOrder.metadata.blockTimestamp);
    const txHash = boughtOrder.hash;
    const blockNumber = ethers.BigNumber.from(boughtOrder.blockNum).toNumber();
    const clientAddress = boughtOrder.to;

    return {
      clientSide,
      baseCurrency,
      quoteCurrency,
      quoteAmount,
      baseAmount,
      blockCreatedAt,
      txHash,
      blockNumber,
      donatedCurrency,
      donatedAmount,
      clientAddress: ethers.utils.getAddress(clientAddress),
      baseCurrencyAddress: baseCurrencyAddress
        ? ethers.utils.getAddress(baseCurrencyAddress)
        : null,
      quoteCurrencyAddress: quoteCurrencyAddress
        ? ethers.utils.getAddress(quoteCurrencyAddress)
        : null,
      donatedCurrencyAddress: donatedCurrencyAddress
        ? ethers.utils.getAddress(donatedCurrencyAddress)
        : null,
    };
  }

  async getRainbowBalances(): Promise<Balance[]> {
    const swaps = await this.getValidDonationSwaps();
    const currencyToBalance = {};
    for (const swap of swaps) {
      if (Object.keys(currencyToBalance).includes(swap.donatedCurrency)) {
        currencyToBalance[swap.donatedCurrency].amount += swap.donatedAmount;
      } else {
        currencyToBalance[swap.donatedCurrency] = {
          amount: swap.donatedAmount,
          contractAddress: swap.donatedCurrencyAddress,
        };
      }
    }

    const balances: Balance[] = [];
    for (const currency in currencyToBalance) {
      const item = currencyToBalance[currency];
      const price =
        item.contractAddress === null
          ? await this.coingecko.getETHPrice()
          : await this.coingecko.getPriceByEthereumContractAddress(
              item.contractAddress,
            );
      balances.push({
        symbol: currency,
        amount: item.amount,
        usdPrice: price,
        usdNotional: item.amount * price,
      });
    }
    return balances;
  }

  getAllDonationSwaps() {
    return this.rainbowSwapRepo.findMany({
      where: {
        blockCreatedAt: {
          gte: new Date('2022-11-02'),
        },
      },
      orderBy: {
        blockCreatedAt: 'desc',
      },
    });
  }

  getValidDonationSwaps() {
    return this.rainbowSwapRepo.findMany({
      where: {
        blockCreatedAt: {
          gte: new Date('2022-11-02'),
          lte: new Date('2022-12-07T04:59:59Z'),
        },
      },
      orderBy: {
        blockCreatedAt: 'desc',
      },
    });
  }
}
