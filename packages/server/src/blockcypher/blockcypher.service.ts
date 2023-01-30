import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import * as WebSocket from 'ws';
import { Configuration } from '../config/configuration';

@Injectable()
export class BlockcypherService {
  private readonly logger = new Logger(BlockcypherService.name);
  private readonly baseUrl = 'https://api.blockcypher.com/v1/doge/main';
  private ws: WebSocket;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService<Configuration>,
  ) {
    const token = this.config.get('blockCypherKey');
    this.ws = new WebSocket(
      `wss://socket.blockcypher.com/v1/btc/main?token=${token}`,
    );
  }

  async getBalance(address: string) {
    const { data } = await firstValueFrom(
      this.http.get(this.baseUrl + '/addrs/' + address + '/balance').pipe(
        catchError((e) => {
          this.logger.error(e);
          throw e;
        }),
      ),
    );
    return this.toWholeUnits(data.final_balance);
  }

  async getAddress(address: string) {
    const { data } = await firstValueFrom(
      this.http.get(this.baseUrl + '/addrs/' + address).pipe(
        catchError((e) => {
          this.logger.error(e);
          throw e;
        }),
      ),
    );
    return data;
  }

  async getAddressFull(address: string) {
    const { data } = await firstValueFrom(
      this.http.get(this.baseUrl + '/addrs/' + address + '/full').pipe(
        catchError((e) => {
          this.logger.error(e);
          throw e;
        }),
      ),
    );
    return data;
  }

  private toWholeUnits(amount: number) {
    return amount / 10 ** 8;
  }
}
