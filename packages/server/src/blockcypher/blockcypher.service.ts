import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import * as WebSocket from 'ws';
import { Configuration } from '../config/configuration';

@Injectable()
export class BlockcypherService implements OnModuleInit {
  private readonly logger = new Logger(BlockcypherService.name);
  private readonly baseUrl = 'https://api.blockcypher.com/v1/doge/main';
  private ws: WebSocket;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService<Configuration>,
  ) {
    const token = this.config.get('blockCypherKey');
    // this.ws = new WebSocket(
    //   `ws://socket.blockcypher.com/v1/btc/main?token=${token}`,
    // );
  }

  onModuleInit() {
    this.init();
  }

  init() {
    // this.logger.log('ws on message');
    // this.ws.on('error', (e) => {
    //   this.logger.error(e);
    // });
    // this.ws.onmessage = (e: any) => {
    //   console.log(e);
    // };
    // this.ws.onopen = (event) => {
    //   this.ws.send(JSON.stringify({ event: 'unconfirmed-tx' }));
    // };
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

  async postCreateWebhook(event: object) {
    const { data } = await firstValueFrom(
      this.http.post(this.baseUrl + '/hooks', event).pipe(
        catchError((e) => {
          this.logger.error(e);
          throw e;
        }),
      ),
    );
    return data;
  }

  async getWebhooks() {
    const { data } = await firstValueFrom(
      this.http.get(this.baseUrl + '/hooks').pipe(
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
