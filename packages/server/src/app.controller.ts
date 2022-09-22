import {
  BadRequestException,
  Body,
  CACHE_MANAGER,
  Controller,
  Get,
  Header,
  Inject,
  Logger,
  Param,
  Post,
  Render,
  Req,
  Response,
} from '@nestjs/common';
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
import { Request } from 'express';

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

  @Get('balances')
  async getOwnershipBalances() {
    return this.pixelsRepository.getOwnershipBalances();
  }

  @Get('config/refresh')
  async getConfigRefreshed() {
    await this.pixelService.syncTransfers();
    return this.pixelsRepository.getOwnershipMap();
  }

  @Get('config/refreshEvents')
  async getConfigRefreshedEvents() {
    await this.pixelService.syncTransferEvents();
    return this.pixelsRepository.getOwnershipBalances();
  }

  @Get('transferEvents')
  async getTransferEvents(@Req() request: Request) {
    const filter = request.body.filter as {};
    const sort = request.body.sort as {};
    this.logger.log(`getTransferEvents: ${JSON.stringify(request.query)}`);
    return await this.pixelService.getTranserEvents({filter, sort});
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
      throw new BadRequestException('Could not find token');
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
    const { address } = params;
    if (!this.ethersService.getIsValidEthereumAddress(address)) {
      throw new BadRequestException('Invalid Ethereum address');
    }
    const ens = await this.ethersService.getEnsName(address);
    return { ens };
  }

  @Get('px/metadata/:tokenId')
  async getPixelMetadata(@Param() params) {
    const { tokenId } = params;
    const cacheKey = `METADATA:${tokenId}`;
    const tokenNotMintedMessage = 'NOT_MINTED';

    try {
      const cache = await this.cacheManager.get(cacheKey);
      if (cache === tokenNotMintedMessage) {
        this.logger.log(tokenNotMintedMessage);
        throw new Error(tokenNotMintedMessage);
      } else {
        // todo instead of querying the contract -- query the DB first to ensure the token has been minted actually
        const tokenUri = await this.pixelService.getPixelURI(params.tokenId);
        const { data } = await this.httpService.get(tokenUri).toPromise();
        this.logger.log(
          `got metadata, setting to cache: ${JSON.stringify(data)}`,
        );
        await this.cacheManager.set(cacheKey, data);
        return data;
      }
    } catch (e) {
      if (e.message === tokenNotMintedMessage) {
        this.logger.log('known non-minted token, continuing');
      } else {
        const tokenNotMintedErrorString =
          'ERC721Metadata: URI query for nonexistent token';
        this.logger.log(`GOT ERROR: ${JSON.stringify(e)}`);
        const errorMessage = e.reason;
        const isTokenNotMinted = errorMessage === tokenNotMintedErrorString;
        if (isTokenNotMinted) {
          this.logger.log('non minted token hit. setting cache to not-minted');
          await this.cacheManager.set(cacheKey, tokenNotMintedMessage);
        }
      }
      throw new BadRequestException('Could not get metadata');
    }
  }

  @Get('px/price')
  async getPixelUSDPrice() {
    const cacheKey = 'NOMICS:DOG';
    let usdPrice = await this.cacheManager.get(cacheKey);
    if (!usdPrice) {
      const { data } = await this.nomics.getDOGPrice();
      usdPrice = Number(data[0].price);
      await this.cacheManager.set(cacheKey, usdPrice, { ttl: 60 });
    }

    const dogPerPixel = 55239.89899;
    const price = Number(usdPrice) * dogPerPixel;
    return {
      price,
    };
  }

  @Get('twitter/share/:type/:id')
  @Render('twitter-share')
  async getTwitterShare(@Param() params) {
    const { id, type } = params

    if (!["mint", "burn", "art"].includes(type)) {
      throw new BadRequestException("Unknown type of twitter share")
    }

    const typeToTwitterDataMap = {
      "mint": {
        title: 'Doge Pixel Mint',
        description: 'Doge Pixels minted'
      },
      "burn": {
        title: 'Doge Pixel Burn',
        description: 'Doge Pixels burned'
      },
      "art": {
        title: 'Doge Pixel Art',
        description: 'Pixel Art created from Doge Pixels'
      }
    }

    const imageUrl = `https://s3.amazonaws.com/share.ownthedoge.com/${id}.png`
    return {
      title: typeToTwitterDataMap[type].title, description: typeToTwitterDataMap[type].description, imageUrl, url: imageUrl
    }
  }

  @Post('twitter/upload/image')
  async postToTwitter(@Body() body: { data: string }) {
    const { uuid } = await this.twitter.uploadImageToS3(body.data)
    return {id: uuid}
  }

  @Get('twitter/test')
  async getTwitterBotTest() {
    await this.twitter.DEBUG_TEST();
    return { success: true };
  }

  @Get('discord/test/:tokenId')
  async getDiscordBotTest(@Param() params: { tokenId: number }) {
    await this.discord.DEBUG_TEST(params.tokenId);
    return { success: true };
  }
}
