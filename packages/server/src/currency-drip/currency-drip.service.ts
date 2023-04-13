import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CurrencyDripService {
  constructor(private readonly prisma: PrismaService) {}

  findMany(args?: Prisma.CurrencyDripFindManyArgs) {
    return this.prisma.currencyDrip.findMany(args);
  }

  findFirst(args?: Prisma.CurrencyDripFindFirstArgs) {
    return this.prisma.currencyDrip.findFirst(args);
  }

  create(args?: Prisma.CurrencyDripCreateArgs) {
    return this.prisma.currencyDrip.create(args);
  }
}
