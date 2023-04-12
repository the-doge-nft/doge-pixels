import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CurrencyDripService {
  constructor(private readonly prisma: PrismaService) {
    console.log('💧💧💧💧 CREATE CURRENCY DRIP 💧💧💧💧');
  }

  findFirst(args?: Prisma.CurrencyDripFindFirstArgs) {
    return this.prisma.currencyDrip.findFirst(args);
  }
}
