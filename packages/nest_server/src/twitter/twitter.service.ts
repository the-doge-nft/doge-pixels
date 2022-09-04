import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
const Twitter = require('twitter')
import {ConfigService} from "@nestjs/config";
import {Configuration} from "../config/configuration";
import {EthersService} from "../ethers/ethers.service";
import {OnEvent} from "@nestjs/event-emitter";
import {Events, PixelMintOrBurnPayload} from "../events";
import {PixelImageGeneratorService} from "../pixel-image-generator/pixel-image-generator.service";

@Injectable()
export class TwitterService implements OnModuleInit {
    private readonly logger = new Logger(TwitterService.name)
    private client: any

    constructor(private config: ConfigService<Configuration>, private imageGenerator: PixelImageGeneratorService) {
    }

    async onModuleInit() {
        this.logger.log(`init twitter client`)
        this.client = new Twitter({
            consumer_key: this.config.get("twitter").consumerKey,
            consumer_secret: this.config.get("twitter").consumerSecret,
            access_token_key: this.config.get("twitter").accessToken,
            access_token_secret: this.config.get("twitter").secret
        })
    }

    @OnEvent(Events.PIXEL_MINT_OR_BURN)
    async tweetPixelEventImage({from, to, tokenId}: PixelMintOrBurnPayload) {
        this.logger.log(`generating tweet: ${from} -- ${to} -- ${tokenId}`)
        const textContent = await this.imageGenerator.getTextContent(from, to , tokenId)


        // todo: this should probably be implicity called from function below -- twitter should have no idea about this
        const txtImage = textContent.includes('minted') ? this.imageGenerator.mintedImage : this.imageGenerator.burnedImage
        await this.imageGenerator.createImageWithPointer(tokenId)
        const base64Image = this.imageGenerator.generatePostImage(tokenId, txtImage, false)

        const mediaId = await this.uploadImageToTwitter(base64Image)
        await this.tweet(mediaId, textContent)
    }

    private uploadImageToTwitter(mediaData): Promise<string> {
        return new Promise((resolve, reject) => {
            this.client.post('media/upload', {media_data: mediaData}, (err, data, response) => {
                if (!err) {
                    const mediaId = data.media_id_string;
                    this.logger.log(`Got media ID: ${mediaId}`)
                    resolve(mediaId)
                }
            })
        })
    }

    private tweet(media_id: string, status: string) {
        this.client.post('statuses/update', {
            status,
            media_ids: media_id
        }, (err) => {
            if (err) {
                this.logger.error(`Error occurred updating status: ${JSON.stringify(err)}`)
            } else {
                this.logger.log(`Tweet successful`)
            }
        })
    }
}
