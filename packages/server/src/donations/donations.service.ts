import { ChainName, Donations } from '@prisma/client';
import { SoChainNetorks, SochainService } from './../sochain/sochain.service';
import { DOGE_CURRENCY, DonationsRepository } from './donations.repository';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AssetTransfersCategory, AssetTransfersOrder } from 'alchemy-sdk';
import { AlchemyService } from '../alchemy/alchemy.service';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';

@Injectable()
export class DonationsService implements OnModuleInit {
  private logger = new Logger(DonationsService.name);
  private dogeCoinAddress = 'D8HjKf37rF3Ho7tjwe17MPN8xQ2UbHSUhB';
  private ethereumAddress = '0x633aC73fB70247257E0c3A1142278235aFa358ac';

  constructor(
    private readonly alchemy: AlchemyService,
    private readonly donationsRepo: DonationsRepository,
    private readonly sochain: SochainService,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  onModuleInit() {
    this.logger.log('💸 Donation service init');
  }

  async syncRecentDogeDonations() {
    const mostRecentDonation =
      await this.donationsRepo.getMostRecentDogeDonation();
    try {
      if (mostRecentDonation) {
        await this.syncDogeDonationsFromMostRecent(mostRecentDonation);
      } else {
        await this.syncAllDogeDonations();
      }
    } catch (e) {
      this.logger.error('Could not sync Doge donations');
      this.sentryClient.instance().captureException(e);
    }
  }

  private async syncDogeDonationsFromMostRecent(donation: Donations) {
    this.logger.log(
      `Syncing dogecoin donations from block number ${donation.blockNumber} : hash ${donation.txHash}`,
    );
    // check if there are any new txs past our most recent synced tx
    const donations = await this.sochain.getTxsReceived(
      this.dogeCoinAddress,
      SoChainNetorks.DOGE,
      donation.txHash,
    );

    if (donations.length > 0) {
      await this.syncAllDogeDonations();
    }
  }

  private async syncAllDogeDonations() {
    this.logger.log('Syning all dogecoin donations');
    const txs = await this.sochain.getAllNonChangeReceives(
      this.dogeCoinAddress,
    );
    await this.upsertDogeDonations(txs);
  }

  private async upsertDogeDonations(donations: any[]) {
    for (const donation of donations) {
      await this.donationsRepo.upsert({
        txHash: donation.txid,
        fromAddress: donation?.incoming.inputs.filter(
          (input) => input.input_no === 0,
        )?.[0]?.address,
        blockNumber: donation.block_no,
        toAddress: this.dogeCoinAddress,
        blockchain: ChainName.DOGECOIN,
        currency: DOGE_CURRENCY,
        amount: Number(donation.incoming.value),
        blockCreatedAt: new Date(donation.time * 1000),
      });
    }
  }

  // ------------------------------------------------------------------------------------------------- //

  async syncEthereumDonations() {
    const transfers = await this.getEthereumDonations();
    this.logger.log(transfers);
  }

  private async getEthereumDonations() {
    const transfers = await this.alchemy.getAssetTransfers({
      order: AssetTransfersOrder.ASCENDING,
      toAddress: this.ethereumAddress,
      category: [AssetTransfersCategory.ERC20, AssetTransfersCategory.EXTERNAL],
      maxCount: 100,
      withMetadata: true,
    });
    return transfers;
  }
}
