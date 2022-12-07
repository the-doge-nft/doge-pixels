import { Listener } from '@ethersproject/providers';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Alchemy,
  AlchemySubscription,
  AssetTransfersWithMetadataParams,
  Network,
} from 'alchemy-sdk';
import { Configuration } from '../config/configuration';
import { CacheService } from './../cache/cache.service';

export type SupportedNetwork =
  | Network.ETH_MAINNET
  | Network.MATIC_MAINNET
  | Network.ARB_MAINNET;

@Injectable()
export class AlchemyService implements OnModuleInit {
  private logger = new Logger(AlchemyService.name);
  private alchemyMainnet: Alchemy;
  private alchemyPolygon: Alchemy;
  private alchemyArbitrum: Alchemy;

  constructor(
    private readonly cache: CacheService,
    private readonly configService: ConfigService<Configuration>,
  ) {
    // NOTE WE ARE NOT SUPPORTING TESTNETS HERE
    this.alchemyMainnet = new Alchemy({
      apiKey: this.configService.get('alchemyKey'),
      network: Network.ETH_MAINNET,
    });
    this.alchemyPolygon = new Alchemy({
      apiKey: this.configService.get('alchemyKey'),
      network: Network.MATIC_MAINNET,
    });
    this.alchemyArbitrum = new Alchemy({
      apiKey: this.configService.get('alchemyKey'),
      network: Network.ARB_MAINNET,
    });
  }

  onModuleInit() {
    this.logger.log(`🧙‍♂️ Alchemy init on network: ${Network.ETH_MAINNET}`);
  }

  getAssetTransfers(
    params: AssetTransfersWithMetadataParams,
    network: SupportedNetwork = Network.ETH_MAINNET,
  ) {
    if (network === Network.ETH_MAINNET) {
      return this.alchemyMainnet.core.getAssetTransfers(params);
    } else if (network === Network.ARB_MAINNET) {
      return this.alchemyArbitrum.core.getAssetTransfers(params);
    } else {
      return this.alchemyPolygon.core.getAssetTransfers(params);
    }
  }

  getBalance(address: string, network: SupportedNetwork = Network.ETH_MAINNET) {
    if (network === Network.ETH_MAINNET) {
      return this.alchemyMainnet.core.getBalance(address);
    } else if (network === Network.ARB_MAINNET) {
      return this.alchemyArbitrum.core.getBalance(address);
    } else {
      return this.alchemyPolygon.core.getBalance(address);
    }
  }

  getTokenBalances(address: string) {
    return this.alchemyMainnet.core.getTokenBalances(address);
  }

  getTokenMetadata(address: string) {
    const cacheKey = `ALCHEMY:METADATA:${address}`;
    return this.cache.getOrQueryAndCache(
      cacheKey,
      () => this.alchemyMainnet.core.getTokenMetadata(address),
      60 * 60 * 60,
    );
  }

  listenForTransfersToAddress(address: string, callback: Listener) {
    this.logger.log(`init listening to transfers to address: ${address}`);
    this.alchemyMainnet.ws.on(
      {
        method: AlchemySubscription.MINED_TRANSACTIONS,
        addresses: [{ to: address }],
      },
      callback,
    );
  }
}
