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

@Injectable()
export class AlchemyService implements OnModuleInit {
  private logger = new Logger(AlchemyService.name);
  private alchemy: Alchemy;

  constructor(
    private readonly cache: CacheService,
    private readonly configService: ConfigService<Configuration>,
  ) {
    // NOTE WE ARE NOT SUPPORTING TESTNETS HERE
    this.alchemy = new Alchemy({
      apiKey: this.configService.get('alchemyKey'),
      network: Network.ETH_MAINNET,
    });
  }

  onModuleInit() {
    this.logger.log(`🧙‍♂️ Alchemy init on network: ${Network.ETH_MAINNET}`);
  }

  getAssetTransfers(params: AssetTransfersWithMetadataParams) {
    return this.alchemy.core.getAssetTransfers(params);
  }

  getBalance(address: string) {
    return this.alchemy.core.getBalance(address);
  }

  getTokenBalances(address: string) {
    return this.alchemy.core.getTokenBalances(address);
  }

  getTokenMetadata(address: string) {
    const cacheKey = `ALCHEMY:METADATA:${address}`;
    return this.cache.getOrQueryAndCache(
      cacheKey,
      () => this.alchemy.core.getTokenMetadata(address),
      60 * 60 * 60,
    );
  }

  listenForTransfersToAddress(address: string, callback: Listener) {
    this.logger.log(`init listening to transfers to address: ${address}`);
    this.alchemy.ws.on(
      {
        method: AlchemySubscription.MINED_TRANSACTIONS,
        addresses: [{ to: address }],
      },
      callback,
    );
  }
}
