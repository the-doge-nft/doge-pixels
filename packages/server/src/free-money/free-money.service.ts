import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import { CurrencyDripService } from '../currency-drip/currency-drip.service';
import { OwnTheDogeContractService } from '../ownthedoge-contracts/ownthedoge-contracts.service';

@Injectable()
export class FreeMoneyService implements OnModuleInit {
  private readonly logger = new Logger(FreeMoneyService.name);
  private readonly AMOUNT_TO_DRIP = 69;

  constructor(
    private readonly currencyDrip: CurrencyDripService,
    private readonly contracts: OwnTheDogeContractService,
  ) {}

  onModuleInit() {
    this.logger.log(`💰🐕💰🐕 CREATE FREE $DOG MONEY SERVICE 💰🐕💰🐕`);
  }

  async canGet(address: string) {
    const to = ethers.utils.getAddress(address);
    const tx = await this.currencyDrip.findFirst({
      where: { to },
    });
    return !tx;
  }

  async drip(address: string) {
    const tx = await this.contracts.sendDogToAddress(
      address,
      this.AMOUNT_TO_DRIP,
    );
    const { hash } = tx;
    const write = await this.currencyDrip.create({
      data: {
        from: '',
        to: address,
        txId: hash,
      },
    });
    return this.contracts.sendDogToAddress(address, this.AMOUNT_TO_DRIP);
  }

  getBalance() {
    return this.contracts.getDogDripBalance();
  }
}
