import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/configuration';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class NomicsService {
  constructor(
    private readonly config: ConfigService<Configuration>,
    private httpService: HttpService,
  ) {}

  getDOGPrice() {
    return this.httpService
      .get('https://api.nomics.com/v1/currencies/ticker', {
        params: {
          ids: 'DOG4',
          key: this.config.get('nomicsKey'),
        },
        timeout: 10000,
      })
      .toPromise();
  }
}
