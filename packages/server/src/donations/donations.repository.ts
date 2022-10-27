import { Injectable } from '@nestjs/common';
import { AlchemyService } from '../alchemy/alchemy.service';
import { CoinGeckoService } from '../coin-gecko/coin-gecko.service';
import { EthersService } from '../ethers/ethers.service';
import { PrismaService } from './../prisma.service';

@Injectable()
export class DonationsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ethers: EthersService,
    private readonly alchemy: AlchemyService,
    private readonly coingecko: CoinGeckoService
    ) {}

  
}
