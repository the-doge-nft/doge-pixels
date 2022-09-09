import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
    GatewayIntentBits,
} from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/configuration';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';

@Injectable()
export class ShareService implements OnModuleInit {
    private readonly logger = new Logger(ShareService.name);


    constructor(
        private readonly config: ConfigService<Configuration>,
        @InjectSentry() private readonly sentryClient: SentryService,
    ) {}

    onModuleInit() {}

    async uploadToS3(fileName: string, body: any) {}

}
