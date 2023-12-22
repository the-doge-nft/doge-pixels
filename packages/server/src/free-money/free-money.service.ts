import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { ethers } from 'ethers';
import { CurrencyDripService } from '../currency-drip/currency-drip.service';
import { CurrencyService } from '../currency/currency.service';
import { formatAddress } from '../helpers/strings';
import { OwnTheDogeContractService } from '../ownthedoge-contracts/ownthedoge-contracts.service';

export class AlreadyClaimedError extends Error {}
export class InvalidSignatureError extends Error {}
export class NotEnoughBalanceError extends Error {}
export class NotEnoughEthBalanceError extends Error {}

@Injectable()
export class FreeMoneyService implements OnModuleInit {
  private readonly logger = new Logger(FreeMoneyService.name);
  private readonly AMOUNT_TO_DRIP = 4200;
  private readonly messageToSign = 'gib free 69 DOG plz';

  constructor(
    private readonly currencyDrip: CurrencyDripService,
    private readonly otd: OwnTheDogeContractService,
    private readonly currency: CurrencyService,
    @InjectSentry() private readonly sentry: SentryService,
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

    const balance = await this.otd.getDogDripBalance();
    if (
      ethers.BigNumber.from(balance).lt(
        ethers.utils.parseEther(this.AMOUNT_TO_DRIP.toString()),
      )
    ) {
      this.sentry
        .instance()
        .captureMessage(
          `NOT ENOUGH DRIP BALANCE -- ${ethers.utils.parseEther(
            this.AMOUNT_TO_DRIP.toString(),
          )}`,
        );
      throw new NotEnoughBalanceError();
    }

    const estimatedTxFee = await this.otd.getEthTxFeesForERC20Transfer(
      this.otd.getDogDripAddress(),
      address,
      ethers.utils.parseEther(this.AMOUNT_TO_DRIP.toString()),
    );
    const ethBalance = await this.otd.getDripEthBalance();
    console.log(
      `ESTIMATED FEE BALANCE: ${estimatedTxFee} -- ETH BALANCE: ${ethBalance}`,
    );
    if (ethers.BigNumber.from(estimatedTxFee).gt(ethBalance)) {
      this.sentry
        .instance()
        .captureMessage(
          `NOT ENOUGH ETH BALANCE -- ESTIMATED: ${estimatedTxFee} -- BALANCE: ${ethBalance}`,
        );
      throw new NotEnoughEthBalanceError();
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
        currencyAmountAtoms: ethers.utils
          .parseEther(this.AMOUNT_TO_DRIP.toString())
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

  getTxs() {
    return this.currencyDrip.findMany();
  }

  async getFormattedBalance() {
    const balance = await this.otd.getDogDripBalance();
    return ethers.utils.formatEther(balance.toString());
  }

  getAddressTxs(address: string) {
    return this.currencyDrip.findMany({
      where: { to: formatAddress(address) },
    });
  }
}
