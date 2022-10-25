import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class DonationsService implements OnModuleInit {
    private logger = new Logger(DonationsService.name);
    private dogeCoinAddress = "D8HjKf37rF3Ho7tjwe17MPN8xQ2UbHSUhB"
    private ethereumAddress = "0x9f632a96587B7c8A7a12A13cFcc1b3678dc37958"

    constructor() {
    }

    onModuleInit() {
        this.logger.log("Donation service init")
    }

    syncDogeDonations() {

    }
}
