import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Campaign, ChainName } from '@prisma/client';
import { Request } from 'express';
import { ConfirmedTx } from '../blockcypher/blockcypher.interfaces';
import { Configuration } from '../config/configuration';
import { BlockcypherService } from './../blockcypher/blockcypher.service';
import { AppEnv } from './../config/configuration';
import { DonationHookRequestService } from './../donation-hook-request/donation-hook-request.service';
import {
  DOGE_CURRENCY_SYMBOL,
  DonationsAfterGet,
  DonationsService,
} from './../donations/donations.service';
import { MydogeService } from './../mydoge/mydoge.service';

@Injectable()
export class PhService {
  private logger = new Logger(PhService.name);
  private dogeAddress = 'DNk1wuxV4DqiPMvqnwXU6R1AirdB7YZh32';
  private phHookUrl: string;

  constructor(
    private readonly blockcypher: BlockcypherService,
    private readonly donations: DonationsService,
    private readonly mydoge: MydogeService,
    private readonly http: HttpService,
    private readonly donationHook: DonationHookRequestService,
    private readonly config: ConfigService<Configuration>,
  ) {
    if (this.config.get('appEnv') === AppEnv.production) {
      throw new Error('No url yet');
    } else {
      this.phHookUrl = 'http://testnet.pleasr.house/api/dogecoin/hook';
    }
  }

  // init() {}

  getAddress() {
    return this.blockcypher.getAddress(this.dogeAddress);
  }

  getAddressFull() {
    return this.blockcypher.getAddressFull(this.dogeAddress);
  }

  getBalance() {
    return this.blockcypher.getBalance(this.dogeAddress);
  }

  async getLeaderboard() {
    const donations = this.donations.findMany({
      orderBy: { blockCreatedAt: 'desc' },
      where: {
        campaign: Campaign.PH,
        blockCreatedAt: { gte: new Date('2023-01-01T00:00:00Z') },
        blockchain: ChainName.ETHEREUM,
      },
    });
    console.log('donations', donations);
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

  async processWebhook(tx: ConfirmedTx) {
    this.logger.log(`processing tx ${tx.hash}...`);
    const donation = await this.upsertTx(tx);
    // blockcypher webhook should not send us duplicates, but lets make sure
    return donation;
  }

  async pingWebhook(donation: DonationsAfterGet) {
    const donationId = donation.id;
    const url = this.phHookUrl;
    let isSuccessful = false;
    let responseCode: number;
    let response: string;
    try {
      const res = await this.http.axiosRef.post(this.phHookUrl, donation);
      this.logger.log(`ph hook success: ${donation.id}`);

      isSuccessful = true;
      responseCode = res.status;
      response = JSON.stringify(res.data);
    } catch (e) {
      this.logger.error(`ph hook error: ${donation.id}`);

      isSuccessful = false;
      responseCode = e.response?.status;
      response = JSON.stringify(e.response?.data);
    } finally {
      await this.donationHook.create({
        data: { donationId, url, isSuccessful, responseCode, response },
      });
    }
  }

  async sendAPing(id: number) {
    const donation = await this.donations.findFirstOrThrow({ where: { id } });
    // return this.pingWebhook(donation);
    return donation;
  }

  getDonations() {
    return this.donations.findMany({
      where: { campaign: Campaign.PH },
      orderBy: { blockCreatedAt: 'desc' },
    });
  }

  async upsertTx(tx: ConfirmedTx) {
    // more than one output can have the same address but is extremely rare
    const donationOutputs = tx.outputs.filter((output) =>
      output.addresses.includes(this.dogeAddress),
    );

    if (donationOutputs.length === 0) {
      this.logger.log(
        'dogecoin donation address not in output -- this is an outgoing tx from the address -- skipping',
      );
      return;
    }

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
    return this.donations.findMany({ where: { id: donation.id } });
  }
}
