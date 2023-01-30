import { Injectable } from '@nestjs/common';
import { Campaign, ChainName } from '@prisma/client';
import { BlockcypherService } from './../blockcypher/blockcypher.service';
import { DonationsService } from './../donations/donations.service';

@Injectable()
export class PhService {
  private dogeAddress = 'DNk1wuxV4DqiPMvqnwXU6R1AirdB7YZh32';

  constructor(
    private readonly blockcypher: BlockcypherService,
    private readonly donations: DonationsService,
  ) {}

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
}
