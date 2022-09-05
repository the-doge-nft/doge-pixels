import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
const Jimp = require("jimp");
import { writeFile } from "fs";
import {PixelsService} from "../pixels/pixels.service";
import {createCanvas} from "canvas";
import {EthersService} from "../ethers/ethers.service";
import {ConfigService} from "@nestjs/config";
import {Configuration} from "../config/configuration";
import {InjectSentry, SentryService} from "@travelerdev/nestjs-sentry";

@Injectable()
export class PixelImageGeneratorService implements OnModuleInit {
    private logger = new Logger(PixelImageGeneratorService.name)

    private pixelOffsetX = 50;
    private topPixeOffsetY = 20;
    private bottomPixelOffsetY = 350;
    private pixelWidth = 90;
    private pixelHeight = 90;
    private pixelTextHeight = 30;
    private shadowWidth = 6;

    public mintedImage: any
    public burnedImage: any

    constructor(
        private pixels: PixelsService,
        private ethers: EthersService,
        private config: ConfigService<Configuration>,
        @InjectSentry() private readonly sentryClient: SentryService,
    ) {
    }

    async onModuleInit() {
        this.mintedImage = await Jimp.read('src/assets/images/mint.png');
        this.burnedImage = await Jimp.read('src/assets/images/burn.png');
    }

    /**
     * Generate Pixel image right drop shadow
     * @param {width of the drop shadow} width
     * @param {heigth of the drop shadow} height
     * @returns Jimp instance
     */
    private generateShadow(width: number, height: number) {
        const blackNum = parseInt('000000' + 'ff', 16);
        let jimp = new Jimp(width, height);

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                jimp.setPixelColor(blackNum, x, y); // draw border
            }
        }
        return jimp
    }

    /**
     * Generate Pixel image with WIDTH and HEIGTH based on the color
     * @param {color of Pixel image} color
     * @returns Jimp instance
     */
    private generatePixelImage(color: string) {
        const hex = color.replace('#', '');
        const num = parseInt(hex + 'ff', 16);
        const blackNum = parseInt('000000' + 'ff', 16);
        const whiteNum = parseInt('fffced' + 'ff', 16);
        let jimp = new Jimp(this.pixelWidth, this.pixelHeight + this.pixelTextHeight);

        for (let x = 0; x < this.pixelWidth; x++) {
            for (let y = 0; y < this.pixelHeight + this.pixelTextHeight; y++) {
                if (x === 0 || x === this.pixelWidth - 1 || y === 0 || y === this.pixelHeight - 1) {
                    jimp.setPixelColor(blackNum, x, y); // draw border
                } else if (y < this.pixelHeight) {
                    jimp.setPixelColor(num, x, y); // draw pixel image
                } else {
                    jimp.setPixelColor(whiteNum, x, y); // draw white borad for coordinates
                }
            }
        }
        return jimp
    }

    /**
     * Draw and fill the pointers
     * @param {canvas context} ctx
     * @param {x of the fist pointer} x
     * @param {y of the first pointer} y
     * @param {x of the second pointer} x1
     * @param {y of the second pointer} y1
     * @param {x of the third pointer} x2
     * @param {y of the third pointer} y2
     * @returns canvas context
     */
    drawPointer(ctx, x, y, x1, y1, x2, y2) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#000000';
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        return ctx;
    }

    /**
     * Creates pointer image for token
     * @param {token Id} tokenId
     */
    createPointerImage(tokenId) {
        try {
            const [x, y] = this.pixels.pixelToCoordsLocal(tokenId)
            const [pixelOffsetX, pixelOffsetY] = this.getPixelOffsets(y);
            const canvas = createCanvas(this.pixels.imageWidth, this.pixels.imageHeight)
            let context = canvas.getContext('2d')
            let y1;

            if (pixelOffsetY === this.bottomPixelOffsetY) {
                y1 = this.bottomPixelOffsetY;
            } else {
                y1 = this.bottomPixelOffsetY + this.pixelHeight + this.pixelTextHeight;
            }

            console.log('debug:: y1', y1)

            this.drawPointer(context, x, y, pixelOffsetX + 20, y1, pixelOffsetX + 45, y1);
            const buffer = canvas.toBuffer('image/png')

            this.logger.log(`starting to write file: ${tokenId}`)
            return new Promise ((resolve, reject) =>  {
                writeFile(`src/assets/images/pointer${tokenId}.png`, buffer, null, async () => {
                    this.logger.log(`done writing file: ${tokenId}`)
                    resolve("success");
                })
            });
        } catch (error) {
            this.logger.error(error.message)
            this.sentryClient.instance().captureMessage(error)
        }
    }

    getPixelOffsets(y: number) {
        if (y <= this.pixels.imageHeight / 2) {
            return [this.pixelOffsetX, this.bottomPixelOffsetY];
        } else {
            return [this.pixelOffsetX, this.topPixeOffsetY];
        }
    }

    async getTextContent(from, to, tokenId) {
        if (from === this.ethers.zeroAddress || to === this.ethers.zeroAddress) {
            const action = from === this.ethers.zeroAddress ? 'minted' : 'burned'
            const address = from === this.ethers.zeroAddress ? to : from
            const ens = await this.ethers.getEnsName(address)
            const [x, y] = this.pixels.pixelToCoordsLocal(tokenId)
            let content = `Pixel (${x}, ${y}) ${action} by ${ens ? ens : address}\n`
            content += `${this.config.get('isProd') ? 'pixels.ownthedoge.com' : 'dev.pixels.ownthedoge.com'}/px/${tokenId}`
            return content
        } else {
            this.logger.log(`Transfer was not a burn or mint event -- error out`)
            throw new Error("Should not be called")
        }
    }

    async generatePostImage(tokenId, txtImg, isDiscord): Promise<string> {
        const [x, y] = this.pixels.pixelToCoordsLocal(tokenId)
        const color = this.pixels.pixelToHexLocal(tokenId);

        this.logger.log(`reading image for compilation: ${tokenId}`)
        const pointerImg = await Jimp.read(`src/assets/images/${isDiscord ? "discord_pointer" : "pointer"}${tokenId}.png`);

        const backgroundImage = await Jimp.read('src/assets/images/background.png');
        this.logger.log(`writing pointer: ${tokenId}`)

        // merge pointer image with background image
        let image = backgroundImage.composite(pointerImg, 0, 0);

        // merge pixel image with background image
        const pixelImage = this.generatePixelImage(color);
        const [pixelOffsetX, pixelOffsetY] = this.getPixelOffsets(y);
        image = image.composite(pixelImage, pixelOffsetX, pixelOffsetY);

        // merge box shadow
        const rightShadow = this.generateShadow(this.shadowWidth, this.pixelHeight + this.pixelTextHeight);
        image = image.composite(rightShadow, pixelOffsetX + this.pixelWidth, pixelOffsetY + this.shadowWidth)
        const bottomShadow = this.generateShadow(this.pixelWidth - this.shadowWidth, this.shadowWidth);
        image = image.composite(bottomShadow, pixelOffsetX + this.shadowWidth, pixelOffsetY + this.pixelHeight + this.pixelTextHeight)

        // merge minted text image with background image
        image = image.composite(txtImg, 400, 430);

        // print coordinates
        const font = await Jimp.loadFont('src/assets/fonts/PressStart2P-Regular.ttf.fnt');
        image.print(font, pixelOffsetX + 5, pixelOffsetY + this.pixelHeight + 10, `(${x},${y})`);

        const base64image = await image.getBase64Async('image/png')
        return base64image.replace('data:image/png;base64,', '')
    }

}
