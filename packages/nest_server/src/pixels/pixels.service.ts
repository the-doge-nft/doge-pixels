import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { OnEvent } from '@nestjs/event-emitter';
import { Events } from '../events';
import { ethers } from 'ethers';
import { EthersService } from '../ethers/ethers.service';
import * as ABI from '../contracts/hardhat_contracts.json';
import {ConfigService} from "@nestjs/config";
import {Configuration} from "../config/configuration";
import {from} from "rxjs";
import {log} from "util";

@Injectable()
export class PixelsService implements OnModuleInit {
  private readonly logger = new Logger(PixelsService.name);
  private pxContract: ethers.Contract;
  private dogContract: ethers.Contract;

  constructor(private ethersService: EthersService, private configService: ConfigService<Configuration>) {}

  async onModuleInit() {
    this.logger.log('PixelsService is loaded');
    if (!this.pxContract && !this.dogContract && this.ethersService.provider) {
      this.initContracts(this.ethersService.provider)
    }
  }

  @OnEvent(Events.ETHERS_WS_PROVIDER_CONNECTED)
  async handleProviderConnected(provider: ethers.providers.WebSocketProvider) {
    this.logger.log('provider connected');
    this.initContracts(provider)
  }

  private async initContracts(provider: ethers.providers.WebSocketProvider) {
    await this.connectToContracts(provider)
    this.initPixelListener()
    this.syncTransfers()
  }

  private async connectToContracts(provider: ethers.providers.WebSocketProvider) {
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

  private initPixelListener() {
    this.pxContract.on('Transfer', async (from, to, tokenId, event) => {
      this.logger.log(`new transfer event hit: ${from} -- ${to} -- ${tokenId}`)
    })
  }

  async syncTransfers() {
    const addressToPuppers = {}

    const filter = this.pxContract.filters.Transfer(null, null)
    const fromBlock = this.configService.get('pixelContractDeploymentBlockNumber')
    const toBlock = await this.ethersService.provider.getBlockNumber()

    this.logger.debug(`querying balances from: ${fromBlock} -- to: ${toBlock}`)

    const logs = []
    const step = 5000
    for (let i = fromBlock; i <= toBlock; i += step + 1) {
      const _logs = await this.pxContract.queryFilter(filter, i, i+step)
      logs.push(..._logs)
    }

    const { transactionHash, args } = logs[0]
    const { from, to, tokenId } = args

    this.logger.debug(`got logs of length: ${logs.length}`)
    this.logger.log(`txHash:: ${transactionHash} -- from:: ${from} -- to:: ${to} -- tokenId:: ${tokenId}`)
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
