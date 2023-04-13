import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import { CurrencyDripService } from '../currency-drip/currency-drip.service';
import { CurrencyService } from '../currency/currency.service';
import { formatAddress } from '../helpers/strings';
import { OwnTheDogeContractService } from '../ownthedoge-contracts/ownthedoge-contracts.service';

export class AlreadyClaimedError extends Error {}
export class InvalidSignatureError extends Error {}

@Injectable()
export class FreeMoneyService implements OnModuleInit {
  private readonly logger = new Logger(FreeMoneyService.name);
  private readonly AMOUNT_TO_DRIP = 69;
  private readonly messageToSign = 'gib free 69 DOG plz';

  constructor(
    private readonly currencyDrip: CurrencyDripService,
    private readonly otd: OwnTheDogeContractService,
    private readonly currency: CurrencyService,
  ) {}

  onModuleInit() {
    this.logger.log(`💰🐕💰🐕 CREATE FREE $DOG MONEY SERVICE 💰🐕💰🐕`);
  }

  async validateDrip(address: string, signature: string) {
    const tx = await this.currencyDrip.findFirst({
      where: { to: formatAddress(address) },
    });
    if (tx) {
      throw new AlreadyClaimedError();
    }

    const recoveredAddress = ethers.utils.verifyMessage(
      this.messageToSign,
      signature,
    );
    if (formatAddress(recoveredAddress) !== formatAddress(address)) {
      throw new InvalidSignatureError();
    }

    return true;
  }

  async drip(address: string) {
    const { dog: contractAddress } = this.otd.getContractAddresses();
    const from = this.otd.getDogDripAddress();

    const tx = await this.otd.sendDogToAddressFromDripAddress(
      address,
      this.AMOUNT_TO_DRIP,
    );
    const currency = await this.currency.findFirst({
      where: { contractAddress },
    });
    if (!currency) {
      throw new Error('Dog not found');
    }
    const { hash } = tx;
    const drip = await this.currencyDrip.create({
      data: {
        from,
        to: formatAddress(address),
        txId: hash,
        currencyId: currency.id,
        currencyAmountAtoms: ethers.BigNumber.from(this.AMOUNT_TO_DRIP)
          .pow(18)
          .toString(),
      },
    });
    this.logger.log(`dripped ${this.AMOUNT_TO_DRIP} $DOG to ${address}`);
    this.logger.log(tx);
    this.logger.log(drip);
    return {
      tx,
      drip,
    };
  }

  getBalance() {
    return this.otd.getDogDripBalance();
  }

  getAddressTxs(address: string) {
    return this.currencyDrip.findMany({
      where: { to: formatAddress(address) },
    });
  }
}
