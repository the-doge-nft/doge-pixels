import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { OnEvent } from '@nestjs/event-emitter';
import { Events } from '../events';
import { ethers } from 'ethers';
import { EthersService } from '../ethers/ethers.service';
import * as ABI from '../contracts/hardhat_contracts.json';

@Injectable()
export class PixelsService implements OnModuleInit {
  private readonly logger = new Logger(PixelsService.name);
  private pxContract: ethers.Contract;
  private dogContract: ethers.Contract;

  constructor(private ethersService: EthersService) {}

  onModuleInit() {
    this.logger.log('PixelsService is loaded');
    if (!this.pxContract && !this.dogContract && this.ethersService.provider) {
      this.connectToContracts(this.ethersService.provider);
    }
  }

  syncTransfers() {
    this.logger.log('Syncing transfers');
  }

  @OnEvent(Events.ETHERS_WS_PROVIDER_CONNECTED)
  handleProviderConnected(provider: ethers.providers.WebSocketProvider) {
    this.logger.log('provider connected');
    this.connectToContracts(provider);
  }

  async connectToContracts(provider: ethers.providers.WebSocketProvider) {
    this.logger.log('connecting to contracts');

    const { chainId } = await provider.getNetwork();
    const pxContractInfo =
      ABI[chainId][this.ethersService.network].contracts['PX'];

    const dogContractInfo =
      ABI[chainId][this.ethersService.network].contracts['DOG20'];

    this.pxContract = new ethers.Contract(
      pxContractInfo.address,
      pxContractInfo.abi,
      provider,
    );

    this.dogContract = new ethers.Contract(
      dogContractInfo.address,
      dogContractInfo.abi,
      provider,
    );
  }

  getDogLocked() {
    return this.dogContract.balanceOf(this.pxContract.address);
  }

  getContractAddresses() {
    return {
      dog: this.dogContract.address,
      pixel: this.pxContract.address,
    };
  }

  getPixelURI(tokenId: string) {
    return this.pxContract.tokenURI(tokenId);
  }
}
