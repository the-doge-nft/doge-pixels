import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Request } from 'express';
import * as httpSignature from 'http-signature';
import { catchError, firstValueFrom } from 'rxjs';
import * as WebSocket from 'ws';
import { Configuration } from '../config/configuration';

@Injectable()
export class BlockcypherService implements OnModuleInit {
  private readonly logger = new Logger(BlockcypherService.name);
  private readonly baseUrl = 'https://api.blockcypher.com/v1/doge/main';
  private ws: WebSocket;
  private token: string;
  private signingPubKey =
    'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEflgGqpIAC9k65JicOPBgXZUExen4rWLq05KwYmZHphTU/fmi3Oe/ckyxo2w3Ayo/SCO/rU2NB90jtCJfz9i1ow==';

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService<Configuration>,
  ) {
    this.token = this.config.get('blockCypherKey');
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

  private get authConfig() {
    return { params: { token: this.token } };
  }

  async getBalance(address: string) {
    const { data } = await firstValueFrom(
      this.http
        .get(this.baseUrl + '/addrs/' + address + '/balance', this.authConfig)
        .pipe(
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
      this.http.get(this.baseUrl + '/addrs/' + address, this.authConfig).pipe(
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
      this.http
        .get(this.baseUrl + '/addrs/' + address + '/full', this.authConfig)
        .pipe(
          catchError((e) => {
            this.logger.error(e);
            throw e;
          }),
        ),
    );
    return data;
  }

  // https://www.blockcypher.com/dev/bitcoin/#using-webhooks
  async createWebhook(event: object) {
    const { data } = await firstValueFrom(
      this.http
        .post(
          this.baseUrl + '/hooks',
          { ...event, signKey: 'preset' },
          this.authConfig,
        )
        .pipe(
          catchError((e) => {
            this.logger.error(e);
            throw e;
          }),
        ),
    );
    return data;
  }

  async deleteWebhook(id: string) {
    const { data } = await firstValueFrom(
      this.http
        .delete(this.baseUrl + '/hooks' + `/${id}`, this.authConfig)
        .pipe(
          catchError((e) => {
            this.logger.error(e);
            throw e;
          }),
        ),
    );
    return data;
  }

  async listWebhooks() {
    const { data } = await firstValueFrom(
      this.http.get(this.baseUrl + '/hooks', this.authConfig).pipe(
        catchError((e) => {
          this.logger.error(e);
          throw e;
        }),
      ),
    );
    return data;
  }

  async getWebhookById(id: string) {
    const { data } = await firstValueFrom(
      this.http.get(this.baseUrl + '/hooks' + `/${id}`, this.authConfig).pipe(
        catchError((e) => {
          this.logger.error(e);
          throw e;
        }),
      ),
    );
    return data;
  }

  isHookPingSafe(request: Request) {
    this.logger.log('verifying webhook ping');
    const signature = request.headers.signature;
    this.logger.log(signature);
    const parsedSignature = httpSignature.parsedSignature(signature, {
      headers: ['(request-target)', 'digest', 'date'],
    });
    this.logger.log(parsedSignature);
    const expectedSignature = `(request-target): ${request.method.toLowerCase()} ${
      request.url
    }
digest: ${request.headers['digest']}
date: ${request.headers['date']}`;
    this.logger.log(expectedSignature);
    const verifier = crypto.createVerify('sha256');
    verifier.update(expectedSignature);
    return verifier.verify(
      this.signingPubKey,
      parsedSignature.signature,
      'base64',
    );
  }

  private toWholeUnits(amount: number) {
    return amount / 10 ** 8;
  }
}
