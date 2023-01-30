import { Injectable } from '@nestjs/common';
import { BlockcypherService } from './../blockcypher/blockcypher.service';

@Injectable()
export class PhService {
  private dogeAddress = 'DFEmbNXw53xLWYwgmSP6w2SKhawKz3XZaU';

  constructor(private readonly blockcypher: BlockcypherService) {}

  getBalance() {
    return this.blockcypher.getBalance(this.dogeAddress);
  }

  getLeaderboard() {}
}
