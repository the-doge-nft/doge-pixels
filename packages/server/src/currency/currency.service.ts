import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(private readonly prisma: PrismaService) {}

  create(args?: Prisma.CurrencyCreateArgs) {
    return this.prisma.currency.create(args);
  }

  upsert(args?: Prisma.CurrencyUpsertArgs) {
    return this.prisma.currency.upsert(args);
  }

  findFirst(args?: Prisma.CurrencyFindFirstArgs) {
    return this.prisma.currency.findFirst(args);
  }
}
