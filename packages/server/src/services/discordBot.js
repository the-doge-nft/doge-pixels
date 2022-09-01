const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { createCanvas } = require("canvas");
const Jimp = require("jimp");
const ethers = require("ethers");
const logger = require("../config/config");
const { sentryClient } = require("./Sentry");
const { isProd, discord_channel_id, discord_token } = require("../config/vars");

const {
    pupperToPixelCoordsLocal,
    getPixelOffsets,
    generatePostImage,
    BOTTOM_PIXEL_OFFSET_Y,
    TOP_PIXEL_OFFSET_Y,
    PIXEL_HEIGHT,
    WIDTH,
    HEIGHT,
    PIXEL_TEXT_HEIGHT,
    drawPointer,
} = require("./twitterBot");

let mintedImage;
let burnedImage;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once("ready", () => {
  logger.info("Discord bot Ready!");
});

client.login(discord_token);

async function discordBot(from, to, tokenId, provider) {
    mintedImage = await Jimp.read("src/assets/images/mint.png");
    burnedImage = await Jimp.read("src/assets/images/burn.png");

    try {
        if (
        from === ethers.constants.AddressZero ||
        to === ethers.constants.AddressZero
        ) {
        let initiator;
        if (from === ethers.constants.AddressZero) {
            initiator = "minted";
        } else {
            initiator = "burned";
        }

        const [x, y] = pupperToPixelCoordsLocal(tokenId);
        const user = initiator === "minted" ? to : from;
        const ens = await provider.lookupAddress(user);

        let content = `Pixel (${x}, ${y}) ${initiator} by ${ens ? ens : user}`;
        content += `\n${
            isProd ? "pixels.ownthedoge.com" : "dev.pixels.ownthedoge.com"
        }/px/${tokenId}`;
        logger.info(`discordbot staring add pointer: ${tokenId}`);
        await addPointerImage(tokenId, content);
        }
    } catch (error) {
        logger.error(error);
        sentryClient.captureMessage(`Failed to tweet ${error.message}`);
    }
}

function addPointerImage(tokenId, content) {
  try {
    const [x, y] = pupperToPixelCoordsLocal(tokenId);
    const [pixelOffsetX, pixelOffsetY] = getPixelOffsets(y);
    const canvas = createCanvas(WIDTH, HEIGHT);
    let context = canvas.getContext("2d");
    let y1;

    if (pixelOffsetY === BOTTOM_PIXEL_OFFSET_Y) {
      y1 = BOTTOM_PIXEL_OFFSET_Y;
    } else {
      y1 = TOP_PIXEL_OFFSET_Y + PIXEL_HEIGHT + PIXEL_TEXT_HEIGHT;
    }

    context = drawPointer(
      context,
      x,
      y,
      pixelOffsetX + 20,
      y1,
      pixelOffsetX + 45,
      y1
    );
    const buffer = canvas.toBuffer("image/png");
    logger.info(`discord bot starting to write file: ${tokenId}`);

    return new Promise((resolve, reject) => {
      fs.writeFile(
        `src/assets/images/discord_pointer${tokenId}.png`,
        buffer,
        "",
        async function () {
          logger.info(`done writing file for discord: ${tokenId}`);
          await uploadImageToDiscord(tokenId, content);
          logger.info(`done uploading image for discord: ${tokenId}`);
          resolve("success");
        }
      );
    });
  } catch (error) {
    logger.error(error.message);
    sentryClient.captureMessage(`Failed to add pointer image for discord ${error.message}`);
  }
}

async function uploadImageToDiscord(tokenId, content) {
  try {
    let txtImg;

    if (content.includes("minted")) {
      txtImg = mintedImage;
    } else {
      txtImg = burnedImage;
    }
    const image = await generatePostImage(tokenId, txtImg);

    // get base64 image
    let base64image = await image.getBufferAsync("image/png");
    client.channels.cache.get(discord_channel_id).send({
      content,
      files: [
        {
          attachment: base64image,
        },
      ],
    });

    fs.unlinkSync(`src/assets/images/discord_pointer${tokenId}.png`);
  } catch (error) {
    logger.error(error.message);
    sentryClient.captureMessage(`Failed to upload image ${error.message}`);
  }
}

module.exports = discordBot;
