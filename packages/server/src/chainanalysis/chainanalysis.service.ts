import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { catchError, firstValueFrom } from 'rxjs';
import { Configuration } from '../config/configuration';
import { PixelTransferService } from '../pixel-transfer/pixel-transfer.service';
import { sleep } from './../helpers/sleep';

class EntityNotFoundError extends Error {}

@Injectable()
export class ChainanalysisService implements OnModuleInit {
  private readonly logger = new Logger(ChainanalysisService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly riskStatusToNotify = ['Severe', 'High'];
  constructor(
    private readonly config: ConfigService<Configuration>,
    private readonly http: HttpService,
    private readonly pixels: PixelTransferService,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {
    this.apiKey = this.config.get('chainAnalysisKey');
    if (this.config.get('isProd')) {
      this.baseUrl = 'https://api.chainalysis.com/api/risk';
    } else {
      this.baseUrl = 'https://api.chainalysis.com/api/risk';
    }
  }

  async onModuleInit() {
    if (this.config.get('isProd')) {
      this.getRiskForAllPixelHolders();
    } else {
      this.logger.log('Not querying chainanalysis -- not production env');
    }
  }

  private get authHeader() {
    return { Token: this.apiKey };
  }

  async registerAddress(address: string) {
    const { data } = await firstValueFrom(
      this.http
        .post(
          `${this.baseUrl}/v2/entities`,
          { address },
          { headers: this.authHeader },
        )
        .pipe(
          catchError((e) => {
            this.handleError(e, address);
            throw new Error();
          }),
        ),
    );
    return data;
  }

  async getRiskAssesment(address: string) {
    const { data } = await firstValueFrom(
      this.http
        .get(`${this.baseUrl}/v2/entities/${address}`, {
          headers: this.authHeader,
        })
        .pipe(
          catchError((e) => {
            this.logger.log(e.response.data.message);
            this.handleError(e, address);
            throw new Error();
          }),
        ),
    );
    if (this.riskStatusToNotify.includes(data.risk)) {
      const message = `[RISK ALERT] ${address} has a risk setting of ${data.risk}`;
      this.sentryClient.instance().captureMessage(message);
      this.logger.log(message);
      this.logger.log(data);
    }
    return data;
  }

  async getRiskOrRegister(address: string) {
    try {
      const risk = await this.getRiskAssesment(address);
      return risk;
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        await this.registerAddress(address);
        await sleep(2);
        const risk = await this.getRiskAssesment(address);
        this.logger.log(risk);
        return risk;
      } else {
        this.handleError(e, address);
      }
    }
  }

  private handleError(e: any, address: string) {
    if (
      e.response.data.message ===
      'Entity not found. Please be sure to register the Entity.'
    ) {
      throw new EntityNotFoundError(`User has not been registered: ${address}`);
    } else {
      this.logger.error(e);
      this.sentryClient.instance().captureException(e);
      throw new Error(`Could not get risk status for address: ${address}`);
    }
  }

  @Cron(CronExpression.EVERY_WEEK)
  async getRiskForAllPixelHolders() {
    if (this.config.get('isProd')) {
      const balances = await this.pixels.getBalances();
      for (const address of Object.keys(balances)) {
        await this.getRiskOrRegister(address);
      }
    } else {
      this.logger.log('Not querying chainanalysis -- not production env');
    }
  }
}
