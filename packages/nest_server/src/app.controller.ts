import { Controller, Get, Logger, Param } from '@nestjs/common';
import { PixelsService } from './pixels/pixels.service';
import { ethers } from 'ethers';
import { EthersService } from './ethers/ethers.service';
import { HttpService } from '@nestjs/axios';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);

  constructor(
    private readonly pixelService: PixelsService,
    private readonly ethersService: EthersService,
    private readonly httpService: HttpService,
  ) {}

  @Get('status')
  getStatus() {
    return 'WOW';
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
    const tokenUri = await this.pixelService.getPixelURI(params.tokenId);
    this.logger.log(tokenUri);
    const data = await this.httpService.get(tokenUri).toPromise();
    console.log(data.data);
    return true;
  }
}
