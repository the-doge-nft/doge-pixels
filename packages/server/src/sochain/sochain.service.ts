import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { catchError, firstValueFrom } from 'rxjs';

export enum SoChainNetorks {
  DOGE = 'doge',
  BITCOIN = 'bitcoin',
}

@Injectable()
export class SochainService {
  private logger = new Logger(SochainService.name);

  private readonly baseUrl = 'https://chain.so/api/v2';
  private readonly baseExplorerTxUrl = 'https://chain.so/tx/DOGE';
  constructor(
    private readonly http: HttpService,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  async getAllNonChangeReceives(address: string) {
    const data = await this.getAddress(address);
    // @next -- make sure this logic is correct
    return data?.data?.txs.filter((tx) => {
      const changeTxs = tx?.outgoing?.filter(
        (_tx) => _tx.address.toLowerCase() === address.toLowerCase(),
      );
      if (changeTxs) {
        return false;
      }
      return true;
    });
  }

  private async getAddress(address: string) {
    const { data } = await firstValueFrom(
      this.http.get(this.baseUrl + '/address/doge/' + address).pipe(
        catchError((e) => {
          this.handleError(e);
          throw new Error(`Could not get sochain address data: ${address}`);
        }),
      ),
    );
    return data;
  }

  async getTxsReceived(address: string, afterTxHash?: string) {
    let url = this.baseUrl + '/get_tx_received/doge/' + address;
    if (afterTxHash) {
      url += '/' + afterTxHash;
    }
    const { data } = await firstValueFrom(
      this.http.get(url).pipe(
        catchError((e) => {
          this.handleError(e);
          throw new Error(`Could not get sochain txs received : ${address}`);
        }),
      ),
    );
    return data?.data?.txs;
  }

  private handleError(e: any) {
    this.logger.error(e.response.data);
    this.sentryClient.instance().captureException(e);
  }

  getTxExplorerUrl(txid: string) {
    return this.baseExplorerTxUrl + '/' + txid;
  }

  async getBalance(address: string) {
    const { data } = await firstValueFrom(
      this.http.get(this.baseUrl + '/get_address_balance/doge/' + address).pipe(
        catchError((e) => {
          this.handleError(e);
          throw new Error(`Could not get address balance for: ${address}`);
        }),
      ),
    );
    return Number(data?.data?.confirmed_balance);
  }
}
