import {
  BadRequestException,
  Body,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Render,
} from '@nestjs/common';
import { PixelsService } from './pixels/pixels.service';
import { ethers } from 'ethers';
import { EthersService } from './ethers/ethers.service';
import { HttpService } from '@nestjs/axios';
import { PixelTransferRepository } from './pixel-transfer/pixel-transfer.repository';
import { TwitterService } from './twitter/twitter.service';
import { ConfigService } from '@nestjs/config';
import { DiscordService } from './discord/discord.service';
import { Cache } from 'cache-manager';
import { PixelTransferService } from './pixel-transfer/pixel-transfer.service';
import { PostTransfersDto } from './dto/PostTransfers.dto';
import { CoinGeckoService } from './coin-gecko/coin-gecko.service';

@Controller('/v1')
export class AppController {
  private logger = new Logger(AppController.name);

  constructor(
    private readonly pixels: PixelsService,
    private readonly pixelTransferRepo: PixelTransferRepository,
    private readonly pixelTransferService: PixelTransferService,
    private readonly ethers: EthersService,
    private readonly http: HttpService,
    private readonly pixelService: PixelsService,
    private readonly ethersService: EthersService,
    private readonly twitter: TwitterService,
    private readonly discord: DiscordService,
    private readonly config: ConfigService,
    private readonly gecko: CoinGeckoService,
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
    return this.pixelTransferService.getBalances();
  }

  @Get('config/refresh')
  async getConfigRefreshed() {
    await this.pixelTransferService.syncRecentTransfers();
    return this.pixelTransferService.getBalances();
  }

  @Post('transfers/:address')
  async postTransfersByAddress(
    @Param() { address }: { address: string },
    @Body() { filter, sort }: PostTransfersDto,
  ) {
    return this.pixelTransferRepo.searchPixelTransfersByAddress(
      address,
      filter,
      sort,
    );
  }

  @Post('transfers')
  async postTransfers(@Body() { filter, sort }: PostTransfersDto) {
    return this.pixelTransferRepo.searchPixelTransfers(filter, sort);
  }

  @Get('px/dimensions')
  async getPictureDimensions() {
    return this.pixels.getDimensions();
  }

  @Get('px/balance/:address')
  async getPixelAddressBalance(@Param() params: { address: string }) {
    const balance = await this.pixels.getPixelBalanceByAddress(params.address);
    return { balance: balance.toNumber() };
  }

  @Get('px/owner/:tokenId')
  async getOwnerByTokenId(@Param() params: { tokenId: number }) {
    console.log('debug:: tokenid', Number(params.tokenId));
    const transfer = await this.pixelTransferRepo.findOwnerByTokenId(
      Number(params.tokenId),
    );

    this.logger.log(transfer);

    if (!transfer) {
      throw new BadRequestException('Could not find token');
    }
    return {
      address: transfer.to,
    };
  }

  @Get('dog/locked')
  async getDogLocked() {
    const balance = await this.pixels.getDogLocked();
    return {
      balance: ethers.utils.formatEther(balance),
    };
  }

  @Get('contract/addresses')
  getContractAddresses() {
    return this.pixels.getContractAddresses();
  }

  @Get('ens/:address')
  async getEnsAddress(@Param() params) {
    const { address } = params;
    if (!this.ethers.getIsValidEthereumAddress(address)) {
      throw new BadRequestException('Invalid Ethereum address');
    }
    const ens = await this.ethers.getEnsName(address);
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
        const { data } = await this.pixelService.getTokenMetadata(tokenId);
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
    const usdPrice = await this.gecko.getDOGUSDPrice();
    const dogPerPixel = 55239.89899;
    const price = Number(usdPrice) * dogPerPixel;
    return {
      price,
    };
  }

  @Get('twitter/share/:type/:id')
  @Render('twitter-share')
  async getTwitterShare(@Param() params) {
    const { id, type } = params;

    if (!['mint', 'burn', 'art'].includes(type)) {
      throw new BadRequestException('Unknown type of twitter share');
    }

    const typeToTwitterDataMap = {
      mint: {
        title: 'Doge Pixel Mint',
        description: 'Doge Pixels minted',
      },
      burn: {
        title: 'Doge Pixel Burn',
        description: 'Doge Pixels burned',
      },
      art: {
        title: 'Doge Pixel Art',
        description: 'Pixel Art created from Doge Pixels',
      },
    };

    const imageUrl = `https://s3.amazonaws.com/share.ownthedoge.com/${id}.png`;
    return {
      title: typeToTwitterDataMap[type].title,
      description: typeToTwitterDataMap[type].description,
      imageUrl,
      url: imageUrl,
    };
  }

  @Post('twitter/upload/image')
  async postToTwitter(@Body() body: { data: string }) {
    const { uuid } = await this.twitter.uploadImageToS3(body.data);
    return { id: uuid };
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
