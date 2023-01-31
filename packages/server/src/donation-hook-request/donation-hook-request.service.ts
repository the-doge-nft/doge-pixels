import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './../prisma.service';

@Injectable()
export class DonationHookRequestService {
  constructor(private readonly prisma: PrismaService) {}

  findMany(args: Prisma.DonationHookRequestFindManyArgs) {
    return this.prisma.donationHookRequest.findMany(args);
  }

  create(args: Prisma.DonationHookRequestCreateArgs) {
    return this.prisma.donationHookRequest.create(args);
  }
}
