import {CACHE_MANAGER, Controller, Get, Inject, Logger, Param} from '@nestjs/common';
import { PixelsService } from './pixels/pixels.service';
import { ethers } from 'ethers';
import { EthersService } from './ethers/ethers.service';
import { HttpService } from '@nestjs/axios';
import { PixelsRepository } from './pixels/pixels.repository';
import { TwitterService } from './twitter/twitter.service';
import { ConfigService } from '@nestjs/config';
import { DiscordService } from './discord/discord.service';
import { NomicsService } from './nomics/nomics.service';
import { Cache } from 'cache-manager';

@Controller('/v1')
export class AppController {
  private logger = new Logger(AppController.name);

  constructor(
    private readonly pixelService: PixelsService,
    private readonly pixelsRepository: PixelsRepository,
    private readonly ethersService: EthersService,
    private readonly httpService: HttpService,
    private readonly nomics: NomicsService,
    private readonly twitter: TwitterService,
    private readonly discord: DiscordService,
    private readonly config: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('status')
  getStatus() {
    return (
      'WOW\n' +
      '' +
      '░░░░░░░░░▄░░░░░░░░░░░░░░▄░░░░\n' +
      '░░░░░░░░▌▒█░░░░░░░░░░░▄▀▒▌░░░\n' +
      '░░░░░░░░▌▒▒█░░░░░░░░▄▀▒▒▒▐░░░\n' +
      '░░░░░░░▐▄▀▒▒▀▀▀▀▄▄▄▀▒▒▒▒▒▐░░░\n' +
      '░░░░░▄▄▀▒░▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐░░░\n' +
      '░░░▄▀▒▒▒░░░▒▒▒░░░▒▒▒▀██▀▒▌░░░ \n' +
      '░░▐▒▒▒▄▄▒▒▒▒░░░▒▒▒▒▒▒▒▀▄▒▒▌░░\n' +
      '░░▌░░▌█▀▒▒▒▒▒▄▀█▄▒▒▒▒▒▒▒█▒▐░░\n' +
      '░▐░░░▒▒▒▒▒▒▒▒▌██▀▒▒░░░▒▒▒▀▄▌░\n' +
      '░▌░▒▄██▄▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒▌░\n' +
      '▐▒▀▐▄█▄█▌▄░▀▒▒░░░░░░░░░░▒▒▒▐░\n' +
      '▐▒▒▐▀▐▀▒░▄▄▒▄▒▒▒▒▒▒░▒░▒░▒▒▒▒▌\n' +
      '▐▒▒▒▀▀▄▄▒▒▒▄▒▒▒▒▒▒▒▒░▒░▒░▒▒▐░\n' +
      '░▌▒▒▒▒▒▒▀▀▀▒▒▒▒▒▒░▒░▒░▒░▒▒▒▌░\n' +
      '░▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▒▄▒▒▐░░\n' +
      '░░▀▄▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▄▒▒▒▒▌░░\n' +
      '░░░░▀▄▒▒▒▒▒▒▒▒▒▒▄▄▄▀▒▒▒▒▄▀░░░\n' +
      '░░░░░░▀▄▄▄▄▄▄▀▀▀▒▒▒▒▒▄▄▀░░░░░\n' +
      '░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▀▀░░░░░░░░'
    );
  }

  @Get('config')
  async getOwnershipConfig() {
    return this.pixelsRepository.getOwnershipMap();
  }

  @Get('config/refresh')
  async getConfigRefreshed() {
    await this.pixelService.syncTransfers();
    return this.pixelsRepository.getOwnershipMap();
  }

  @Get('px/dimensions')
  async getPictureDimensions() {
    return this.pixelService.getDimensions();
  }

  @Get('px/balance/:address')
  async getPixelAddressBalance(@Param() params: { address: string }) {
    const balance = await this.pixelService.getPixelBalanceByAddress(
      params.address,
    );
    return { balance: balance.toNumber() };
  }

  @Get('px/owner/:tokenId')
  async getOwnerByTokenId(@Param() params: { tokenId: number }) {
    const token = await this.pixelsRepository.findByTokenId(
      Number(params.tokenId),
    );
    if (!token) {
      throw new Error('Could not find token');
    }
    return {
      address: token.ownerAddress,
    };
  }

  @Get('dog/locked')
  async getDogLocked() {
    const balance = await this.pixelService.getDogLocked();
    return {
      balance: ethers.utils.formatEther(balance),
    };
  }

  @Get('contract/addresses')
  getContractAddresses() {
    return this.pixelService.getContractAddresses();
  }

  @Get('ens/:address')
  async getEnsAddress(@Param() params) {
    const ens = await this.ethersService.getEnsName(params.address);
    return { ens };
  }

  @Get('px/metadata/:tokenId')
  async getPixelMetadata(@Param() params) {
    const { tokenId } = params
    const cacheKey = `METADATA:${tokenId}`
    const notMintedCacheKey = 'NOT_MINTED'

    try {
      const cache = await this.cacheManager.get(cacheKey)
    } catch (e) {

    }


    try {
      const tokenUri = await this.pixelService.getPixelURI(params.tokenId);
      const data = await this.httpService.get(tokenUri).toPromise();
      return data.data;
      console.log(data.data);
    } catch (e) {
      if (e instanceof Error) {

      }

      this.logger.error(e)
    }

  }

  @Get('px/price')
  async getPixelUSDPrice() {
    const { data } = await this.nomics.getDOGPrice();
    const usdPrice = Number(data[0].price);
    const dogPerPixel = 55239.89899;
    return {
      price: usdPrice * dogPerPixel,
    };
  }

  @Get('twitter/test')
  async getTwitterBotTest() {
    if (this.config.get('isDev')) {
      await this.twitter.DEBUG_TEST();
      return { success: true };
    }
    return { success: false };
  }

  @Get('discord/test')
  async getDiscordBotTest() {
    if (this.config.get('isDev')) {
      await this.discord.DEBUG_TEST();
      return { success: true };
    }
    return { success: false };
  }
}
