import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma, TokenType } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CurrencyService implements OnModuleInit {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const contractAddress = '';
    this.logger.log('writing DOG currency');
    await this.upsert({
      where: { contractAddress },
      create: {
        type: TokenType.ERC20,
        decimals: 18,
        symbol: '',
        name: '',
        contractAddress: '',
      },
      update: {},
    });
  }

  create(args?: Prisma.CurrencyCreateArgs) {
    return this.prisma.currency.create(args);
  }

  upsert(args?: Prisma.CurrencyUpsertArgs) {
    return this.prisma.currency.upsert(args);
  }
}
