import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AssetTransfersCategory, AssetTransfersOrder } from 'alchemy-sdk';
import { catchError, firstValueFrom } from 'rxjs';
import { AlchemyService } from '../alchemy/alchemy.service';

@Injectable()
export class DonationsService implements OnModuleInit {
    private logger = new Logger(DonationsService.name);
    private dogeCoinAddress = "D8HjKf37rF3Ho7tjwe17MPN8xQ2UbHSUhB"
    private ethereumAddress = "0x9f632a96587B7c8A7a12A13cFcc1b3678dc37958"

    constructor(
        private readonly http: HttpService,
        private readonly alchemy: AlchemyService
    ) {
    }

    onModuleInit() {
        this.logger.log("Donation service init")
    }

    async syncDogeDonations() {
        const donations = await this.getDogeDonations()
        this.logger.log(donations)
    }

    private async getDogeDonations() {
        const { data } = await firstValueFrom(
            this.http.get(`https://chain.so/api/v2/get_tx_received/doge/${this.dogeCoinAddress}`)
                .pipe(catchError((e) => {
                    this.logger.error(e.response.data)
                    throw new Error("Error getting DOGE transactions")
                }))
        )
        return data
    }

    async syncEthereumDonations() {
        const transfers = await this.getEthereumDonations()
        this.logger.log(transfers)
    }

    private async getEthereumDonations() {
        const transfers = await this.alchemy.getAssetTransfers({
            order: AssetTransfersOrder.ASCENDING,
            toAddress: this.ethereumAddress,
            category: [
                AssetTransfersCategory.ERC20,
                // AssetTransfersCategory.INTERNAL,
                AssetTransfersCategory.EXTERNAL
            ],
            maxCount: 100,
            withMetadata: true
        })
        return transfers
    }
}
