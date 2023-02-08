import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Campaign, ChainName } from '@prisma/client';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { Request } from 'express';
import { Tx } from '../blockcypher/blockcypher.interfaces';
import { Configuration } from '../config/configuration';
import { BlockcypherService } from './../blockcypher/blockcypher.service';
import { DonationHookRequestService } from './../donation-hook-request/donation-hook-request.service';
import {
  DOGE_CURRENCY_SYMBOL,
  DonationsAfterGet,
  DonationsService,
} from './../donations/donations.service';
import { MydogeService } from './../mydoge/mydoge.service';

@Injectable()
export class PhService implements OnModuleInit {
  private logger = new Logger(PhService.name);
  private dogeAddress: string;
  private phHookUrl: string;

  constructor(
    private readonly blockcypher: BlockcypherService,
    private readonly donations: DonationsService,
    private readonly mydoge: MydogeService,
    private readonly http: HttpService,
    private readonly donationHook: DonationHookRequestService,
    private readonly config: ConfigService<Configuration>,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {
    if (this.config.get('isProd')) {
      this.phHookUrl = 'https://pleasr.house/api/webhooks/donations';
      this.dogeAddress = 'D7JykcnAKNVmreu97EcdRY58n4q5MrTRzV';
    } else {
      this.phHookUrl = 'https://testnet.pleasr.house/api/webhooks/donations';
      this.dogeAddress = 'DNk1wuxV4DqiPMvqnwXU6R1AirdB7YZh32';
    }
  }

  onModuleInit() {
    return this.syncDonations();
  }

  // @Cron(CronExpression.EVERY_10_MINUTES)
  async syncDonations() {
    const recentDonation = await this.donations.findFirst({
      where: {
        blockchain: ChainName.DOGECOIN,
        campaign: Campaign.PH,
      },
      orderBy: {
        blockNumber: 'desc',
      },
    });
    if (recentDonation) {
      await this.syncDonationsFromBlock(recentDonation.blockNumber);
    } else {
      await this.syncAllDonations();
    }
  }

  async syncDonationsFromBlock(blockNumber: number) {
    this.logger.log(`syncing ph donations from: ${blockNumber}`);
    const txs = await this.blockcypher.getAllTxs(this.dogeAddress, blockNumber);
    this.logger.log(`got ${txs.length} donations`);
    await this.upsertTxs(txs);
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async syncAllDonations() {
    this.logger.log('syncing all ph dogecoin donations');
    const txs = await this.blockcypher.getAllTxs(this.dogeAddress);
    await this.upsertTxs(txs);
  }

  async getLeaderboard() {
    const donations = await this.donations.findMany({
      orderBy: { blockCreatedAt: 'desc' },
      where: {
        campaign: Campaign.PH,
        blockCreatedAt: { gte: new Date('2023-01-01T00:00:00Z') },
        blockchain: ChainName.DOGECOIN,
        currency: DOGE_CURRENCY_SYMBOL,
      },
    });
    return this.donations.getLeaderboard(donations);
  }

  createWebhook(url: string) {
    return this.blockcypher.createWebhook({
      event: 'confirmed-tx',
      address: this.dogeAddress,
      confirmations: 6,
      url,
    });
  }

  deleteWebhook(id: string) {
    return this.blockcypher.deleteWebhook(id);
  }

  listWebhooks() {
    return this.blockcypher.listWebhooks();
  }

  getWebhookById(id: string) {
    return this.blockcypher.getWebhookById(id);
  }

  getIsHookPingSafe(req: Request) {
    return this.blockcypher.getIsHookPingSafe(req);
  }

  async processWebhook(tx: Tx) {
    this.logger.log(`processing tx ${tx.hash}...`);
    if (this.getIsTxDonation(tx)) {
      const donation = await this.upsertTx(tx);

      try {
        await this.sendPhWebhookWithRetry(donation);
      } catch (e) {
        this.logger.error(e);
      }
      return donation;
    } else {
      this.logger.log(`hook from blockcypher is not a donation: ${tx.hash}`);
      return 'success';
    }
  }

  async upsertTxs(txs: Array<Tx>) {
    for (const tx of txs) {
      if (this.getIsTxDonation(tx)) {
        await this.upsertTx(tx);
      } else {
        this.logger.log(`tx ${tx.hash} is not a donation`);
      }
    }
  }

  getIsTxDonation(tx: Tx) {
    const isFromDonationAddress = tx.inputs.some((input) =>
      input.addresses.includes(this.dogeAddress),
    );

    if (isFromDonationAddress) {
      this.logger.log(
        `${tx.hash}: dogecoin donation address in input -- this is an incoming tx to the address -- skipping`,
      );
      return false;
    }

    // more than one output can have the same address but is rare
    const donationOutputs = tx.outputs.filter((output) =>
      output.addresses.includes(this.dogeAddress),
    );

    if (donationOutputs.length === 0) {
      this.logger.log(
        `${tx.hash}: dogecoin donation address not in output -- this is an outgoing tx from the address -- skipping`,
      );
      return false;
    }
    return true;
  }

  async upsertTx(tx: Tx) {
    // more than one output can have the same address but is rare
    const donationOutputs = tx.outputs.filter((output) =>
      output.addresses.includes(this.dogeAddress),
    );

    let amount = 0;
    for (const output of donationOutputs) {
      amount += output.value;
    }

    const fromAddress = tx.inputs[0].addresses[0];
    try {
      await this.mydoge.refreshCachedName(fromAddress);
    } catch (e) {
      this.logger.error(e);
    }

    const donation = await this.donations.upsert({
      txHash: tx.hash,
      amount: this.blockcypher.toWholeUnits(amount),
      blockCreatedAt: tx.received,
      blockchain: ChainName.DOGECOIN,
      campaign: Campaign.PH,
      currency: DOGE_CURRENCY_SYMBOL,
      blockNumber: tx.block_height,
      toAddress: this.dogeAddress,
      fromAddress,
    });
    return this.donations.findFirstOrThrow({ where: { id: donation.id } });
  }

  async sendPhWebhookWithRetry(donation: DonationsAfterGet) {
    const donationId = donation.id;
    const url = this.phHookUrl;
    let isSuccessful = false;
    let responseCode: number;
    let response: string;
    try {
      const res = await this.sendPhHook(donation);
      this.logger.log(`ph hook success for donation: ${donation.id}`);

      isSuccessful = true;
      responseCode = res.status;
      response = JSON.stringify(res.data);
    } catch (e) {
      isSuccessful = false;
      responseCode = e.response?.status;
      response = JSON.stringify(e.response?.data);

      this.logger.error(
        `ph hook error for donation: ${donation.id} -- received response: ${responseCode}`,
      );

      this.sentryClient.instance().captureException(e);
    } finally {
      await this.donationHook.create({
        data: { donationId, url, isSuccessful, responseCode, response },
      });
    }
  }

  sendPhHook(donation: DonationsAfterGet) {
    this.logger.log(`sending hook to ph: ${donation.txHash}`);
    this.logger.log(`sending donation: ${JSON.stringify(donation, null, 2)}`);
    this.logger.log(`leeeeak: ${this.config.get('phSecret')}`);
    return this.http.axiosRef.post(this.phHookUrl, donation, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.get('phSecret'),
      },
    });
  }

  getDonations() {
    return this.donations.findMany({
      where: { campaign: Campaign.PH },
      orderBy: { blockCreatedAt: 'desc' },
    });
  }

  getHooks() {
    return this.donationHook.findMany({ orderBy: { insertedAt: 'desc' } });
  }

  getAddress() {
    return this.blockcypher.getAddress(this.dogeAddress);
  }

  getAddressFull() {
    return this.blockcypher.getAllTxs(this.dogeAddress);
  }

  getBalance() {
    return this.blockcypher.getBalance(this.dogeAddress);
  }

  async DEV_HOOK_PING(id: number) {
    const donation = await this.donations.findFirstOrThrow({ where: { id } });
    try {
      const res = await this.sendPhHook(donation);
      this.logger.log(`ph hook success: ${donation.id}`);
      this.logger.log(`ph hook response: ${JSON.stringify(res.data)}`);
      this.logger.log(`ph hook response code: ${res.status}`);
    } catch (e) {
      this.logger.error("Could not send a ping to PH's webhook");
      this.logger.error(`ph hook error: ${donation.id}`);
      this.logger.error(
        `ph hook response: ${JSON.stringify(e?.response?.data)}`,
      );
      this.logger.error(`ph hook ERROR response code: ${e?.response.status}`);
      this.sentryClient.instance().captureException(e);
    }
    return donation;
  }
}
