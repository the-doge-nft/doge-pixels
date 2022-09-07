import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { writeFile } from 'fs';
import { PixelsService } from '../pixels/pixels.service';
import { createCanvas, Image } from 'canvas';
import { EthersService } from '../ethers/ethers.service';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/configuration';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { Jimp } from '@jimp/core/types/jimp';
import { Font } from '@jimp/plugin-print';

const path = require('path');
const jimp = require('jimp');

@Injectable()
export class PixelImageGeneratorService implements OnModuleInit {
  private logger = new Logger(PixelImageGeneratorService.name);

  private pixelOffsetX = 50;
  private topPixeOffsetY = 20;
  private bottomPixelOffsetY = 350;
  private pixelWidth = 90;
  private pixelHeight = 90;
  private pixelTextHeight = 30;
  private shadowWidth = 6;

  private mintedImage: Jimp;
  private burnedImage: Jimp;
  private backgroundImage: Jimp;
  private font: Font;

  constructor(
    private pixels: PixelsService,
    private ethers: EthersService,
    private config: ConfigService<Configuration>,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  async onModuleInit() {
    const pathToMint = path.resolve(__dirname, '../assets/images/mint.png');
    const pathToBurn = path.resolve(__dirname, '../assets/images/burn.png');
    const pathToBackgroundImage = path.resolve(
      __dirname,
      '../assets/images/background.png',
    );
    const pathToFont = path.resolve(
      __dirname,
      '../assets/fonts/PressStart2P-Regular.ttf.fnt',
    );
    this.mintedImage = await jimp.read(pathToMint);
    this.burnedImage = await jimp.read(pathToBurn);
    this.backgroundImage = await jimp.read(pathToBackgroundImage);
    this.font = await jimp.loadFont(pathToFont);
  }

  /**
   * Generate Pixel image right drop shadow
   * @param {width of the drop shadow} width
   * @param {heigth of the drop shadow} height
   * @returns jimp instance
   */
  private generateShadow(width: number, height: number) {
    const blackNum = parseInt('000000' + 'ff', 16);
    const image = new jimp(width, height);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        image.setPixelColor(blackNum, x, y); // draw border
      }
    }
    return image;
  }

  /**
   * Generate Pixel image with WIDTH and HEIGTH based on the color
   * @param {color of Pixel image} color
   * @returns jimp instance
   */
  private generatePixelImage(color: string) {
    const hex = color.replace('#', '');
    const num = parseInt(hex + 'ff', 16);
    const blackNum = parseInt('000000' + 'ff', 16);
    const whiteNum = parseInt('fffced' + 'ff', 16);
    const image = new jimp(
      this.pixelWidth,
      this.pixelHeight + this.pixelTextHeight,
    );

    for (let x = 0; x < this.pixelWidth; x++) {
      for (let y = 0; y < this.pixelHeight + this.pixelTextHeight; y++) {
        if (
          x === 0 ||
          x === this.pixelWidth - 1 ||
          y === 0 ||
          y === this.pixelHeight - 1
        ) {
          image.setPixelColor(blackNum, x, y); // draw border
        } else if (y < this.pixelHeight) {
          image.setPixelColor(num, x, y); // draw pixel image
        } else {
          image.setPixelColor(whiteNum, x, y); // draw white borad for coordinates
        }
      }
    }
    return jimp;
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
      const [x, y] = this.pixels.pixelToCoordsLocal(tokenId);
      const [pixelOffsetX, pixelOffsetY] = this.getPixelOffsets(y);
      const canvas = createCanvas(
        this.pixels.imageWidth,
        this.pixels.imageHeight,
      );
      const context = canvas.getContext('2d');
      let y1;

      if (pixelOffsetY === this.bottomPixelOffsetY) {
        y1 = this.bottomPixelOffsetY;
      } else {
        y1 = this.topPixeOffsetY + this.pixelHeight + this.pixelTextHeight;
      }

      this.drawPointer(
        context,
        x,
        y,
        pixelOffsetX + 20,
        y1,
        pixelOffsetX + 45,
        y1,
      );
      return canvas.toBuffer('image/png');
    } catch (error) {
      this.logger.error(error.message);
      this.sentryClient.instance().captureMessage(error);
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
      const action = from === this.ethers.zeroAddress ? 'minted' : 'burned';
      const address = from === this.ethers.zeroAddress ? to : from;
      const ens = await this.ethers.getEnsName(address);
      const [x, y] = this.pixels.pixelToCoordsLocal(tokenId);
      let content = `Pixel (${x}, ${y}) ${action} by ${ens ? ens : address}\n`;
      content += `${
        this.config.get('isProd')
          ? 'pixels.ownthedoge.com'
          : 'dev.pixels.ownthedoge.com'
      }/px/${tokenId}`;
      return content;
    } else {
      this.logger.log(`Transfer was not a burn or mint event -- error out`);
      throw new Error('Should not be called');
    }
  }

  async generateMintOrBurnPixelImage(
    mintOrBurn: 'mint' | 'burn',
    tokenId: number,
  ) {
    const pointerBuffer = await this.createPointerImage(tokenId);
    const pointerImg = await jimp.read(pointerBuffer);

    const [x, y] = this.pixels.pixelToCoordsLocal(tokenId);
    const color = this.pixels.pixelToHexLocal(tokenId);

    // merge pointer image with background image
    let image = this.backgroundImage.composite(pointerImg, 0, 0);

    // merge pixel image with background image
    const pixelImage = this.generatePixelImage(color);
    const [pixelOffsetX, pixelOffsetY] = this.getPixelOffsets(y);
    image = image.composite(pixelImage, pixelOffsetX, pixelOffsetY);

    // merge box shadow
    const rightShadow = this.generateShadow(
      this.shadowWidth,
      this.pixelHeight + this.pixelTextHeight,
    );
    image = image.composite(
      rightShadow,
      pixelOffsetX + this.pixelWidth,
      pixelOffsetY + this.shadowWidth,
    );
    const bottomShadow = this.generateShadow(
      this.pixelWidth - this.shadowWidth,
      this.shadowWidth,
    );
    image = image.composite(
      bottomShadow,
      pixelOffsetX + this.shadowWidth,
      pixelOffsetY + this.pixelHeight + this.pixelTextHeight,
    );

    // merge minted text image with background image
    image = image.composite(
      mintOrBurn === 'mint' ? this.mintedImage : this.burnedImage,
      400,
      430,
    );

    // @ts-ignore
    image.print(
      this.font,
      pixelOffsetX + 5,
      pixelOffsetY + this.pixelHeight + 10,
      `(${x},${y})`,
    );
    return image;
  }

  async generateShareImage(pixelIds: number[], isMinted: boolean) {
    if (pixelIds.length === 0) {
      throw new Error('pixel ids cannot be empty');
    }
    const backgroundImage = new Image();
    backgroundImage.src = await this.backgroundImage.getBufferAsync('img.png');
    const canvas = createCanvas(
      this.pixels.imageWidth,
      this.pixels.imageHeight,
    );
    const ctx = canvas.getContext('2d');
    const markImgData = isMinted ? this.mintedImage : this.burnedImage;
    const markImg = new Image();
    markImg.src = await markImgData.getBufferAsync('img.png');
    ctx.drawImage(
      backgroundImage,
      0,
      0,
      backgroundImage.width,
      backgroundImage.height,
    );
    ctx.drawImage(markImg, 520, 430, 100, 20);
    this.drawPixels(ctx, pixelIds);
    const buffer = canvas.toBuffer('image/png');
    return { buffer, dataURL: canvas.toDataURL() };
  }

  async drawPixels(ctx, pixels) {
    const length = pixels.length;

    if (length < 1) return;

    ctx.save();
    const strokeColor = '#4b0edd';
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;

    for (let i = 0; i < length; i++) {
      const [x, y] = this.pixels.pixelToCoordsLocal(pixels[i]);
      ctx.rect(x, y, 20, 20);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
}
