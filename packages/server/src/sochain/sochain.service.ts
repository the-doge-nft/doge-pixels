import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { catchError, firstValueFrom } from 'rxjs';
import sleep from '../helpers/sleep';

export enum SoChainNetorks {
  DOGE = 'doge',
  BITCOIN = 'bitcoin',
}

export interface TxReceived {
  txid: string;
  output_no: number;
  script_asm: string;
  script_hex: string;
  value: string;
  confirmations: number;
  time: number;
}

interface TxInput {
  input_no: number;
  value: string;
  address: string;
  type: string;
  script: string;
  sequence: number;
  witness: any;
  from_output: object[];
}

interface TxOutput {
  output_no: number;
  value: string;
  address: string;
  type: string;
  script: string;
}

export interface Transaction {
  network: string;
  txid: string;
  blockhash: string;
  block_no: number;
  confirmations: number;
  time: number;
  sent_value: string;
  fee: string;
  inputs: TxInput[];
  outputs: TxOutput[];
  tx_hex: string;
}

@Injectable()
export class SochainService {
  private logger = new Logger(SochainService.name);

  private readonly baseUrl = 'https://chain.so/api/v2';
  private readonly baseExplorerTxUrl = 'https://chain.so/tx/DOGE';
  private readonly MAX_TXS_PER_REQUEST = 100;
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

  private async getTxsReceived(
    address: string,
    afterTxHash?: string,
  ): Promise<TxReceived[]> {
    // response is ordered oldest first and has a cap of 100 txs
    // afterTxHash is used as a paging key to get the remaining txs
    // https://chain.so/api/#get-received-tx
    let url = this.baseUrl + '/get_tx_received/doge/' + address;
    if (afterTxHash) {
      url += '/' + afterTxHash;
    }
    const { data } = await firstValueFrom(
      this.http.get<{ data: { txs: TxReceived[] } }>(url).pipe(
        catchError((e) => {
          this.handleError(e);
          throw new Error(`Could not get sochain txs received : ${address}`);
        }),
      ),
    );
    return data?.data?.txs;
  }

  async getAllTxsReceivedToAddress(
    address: string,
    afterTxHash: string | null = null,
  ) {
    let allTxsReceived: TxReceived[] = [];
    let count = this.MAX_TXS_PER_REQUEST;
    let lastHash = afterTxHash;

    // iterate getting full tx list
    while (count >= this.MAX_TXS_PER_REQUEST) {
      const txs = await this.sleepAndTryAgain(
        () => this.getTxsReceived(address, lastHash ? lastHash : undefined),
        2,
      );

      allTxsReceived = allTxsReceived.concat(txs);
      lastHash = txs[txs.length - 1]?.txid;
      count = txs.length;
    }

    const uniqueTxs: TxReceived[] = [];
    for (const tx of allTxsReceived) {
      const exists = uniqueTxs.find((_tx) => _tx.txid === tx.txid);
      if (exists) {
        console.log(`got repeated txid: ${tx.txid}`);
      } else {
        uniqueTxs.push(tx);
      }
    }

    return uniqueTxs;
  }

  async getTransaction(txId: string): Promise<Transaction> {
    const { data } = await firstValueFrom(
      this.http
        .get<{ data: Transaction }>(this.baseUrl + '/tx/doge/' + txId)
        .pipe(
          catchError((e) => {
            this.handleError(e);
            throw new Error(`Could not get sochain tx: ${txId}`);
          }),
        ),
    );
    return data?.data;
  }

  async getBlock(blockHash: string): Promise<any> {
    const { data } = await firstValueFrom(
      this.http
        .get<{ data: Transaction }>(
          this.baseUrl + '/get_block/doge/' + blockHash,
        )
        .pipe(
          catchError((e) => {
            this.handleError(e);
            throw new Error(`Could not get sochain tx: ${blockHash}`);
          }),
        ),
    );
    return data?.data;
  }

  // @next -- this should be occomplished app wipe as a interceptor?
  async sleepAndTryAgain(callback: () => any, secondsToSleep) {
    try {
      return callback();
    } catch (e) {
      this.logger.error(e);
      this.logger.error(`error caught, sleeping and trying again`);
      await sleep(secondsToSleep);
      return callback();
    }
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
