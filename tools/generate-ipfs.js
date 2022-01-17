const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');
const commandLineArgs = require('command-line-args');
const cliProgress = require('cli-progress');
const optionDefinitions = [
    // {name: 'deploy_id', type: String},
    {name: 'tile_size', type: Number, defaultValue: -1},
    {name: 'deploy_id', type: String, defaultValue: 'n-a'},
    {name: 'deploy_dir', type: String},
    {name: 'cid_pixels', type: String},
    {
        name: 'crop',
        type: Number,
        description: 'If passed, size of crop by percentage 0...1',
        defaultValue: 0
    },
];
const options = commandLineArgs(optionDefinitions);
const OUT_PATH = path.resolve(options.deploy_dir);//__dirname, 'deploy', options.deploy_id);
const PIXELS_PATH = path.join(OUT_PATH, 'pixels');
const METADATA_PATH = path.join(OUT_PATH, 'metadata');
const CID_PIXELS = options.cid_pixels;
const INDEX_OFFSET = 1000000;
const SHARD_SIZE = 5000;

// create a new progress bar instance and use shades_classic theme
const bar1 = new cliProgress.SingleBar(
    {
        format: 'progress [{bar}] {percentage}% | {duration_formatted} | {value}/{total} | ETA: {eta}s '
    }, cliProgress.Presets.shades_classic);

function getFormattedDateTime() {
    const today = new Date();
    const y = (today.getFullYear() + '').padStart(4, '0');
    // JavaScript months are 0-based.
    const m = (today.getMonth() + 1 + '').padStart(2, '0');
    const d = (today.getDate() + '').padStart(2, '0');
    const h = (today.getHours() + '').padStart(2, '0');
    const mm = (today.getMinutes() + '').padStart(2, '0');
    const s = (today.getSeconds() + '').padStart(2, '0');
    return y + "_" + m + "_" + d + "_" + h + "_" + mm + "_" + s;
}

function hexIntToRgba(num) {
    num >>>= 0;
    var a = num & 0xFF / 255,
        b = (num & 0xFF00) >>> 8,
        g = (num & 0xFF0000) >>> 16,
        r = ((num & 0xFF000000) >>> 24);
    return "rgba(" + [r, g, b, a].join(", ") + ")";
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function getShardIndex(x, y, indexWithOffset) {
    // shards count start from 1
    const shard = 1 + Math.floor((indexWithOffset - INDEX_OFFSET) / SHARD_SIZE);
    return shard;
}

function pixelIdentifier(x, y, indexWithOffset) {
    return `${indexWithOffset}`;
}

function hexIntToStr(hex) {
    const rgba = Jimp.intToRGBA(hex);
    const r = rgba.r.toString(16).padStart(2, 0);
    const g = rgba.g.toString(16).padStart(2, 0);
    const b = rgba.b.toString(16).padStart(2, 0);
    if (rgba.a !== 255) {
        throw "A not 255";
    }
    return `#${r}${g}${b}`
}

function createTile(x, y, hexInt, RUN_CONFIG) {
    let SIZE = 'sm';
    let size, prefix;
    const hex = hexIntToStr(hexInt);
    size = options.tile_size;
    prefix = '';//`pixels_${size}x${size}`
    return new Promise((resolve) => {
        // If size passed, generate pixels
        const WRITE_PIXEL = size > 0;
        const index = y * RUN_CONFIG.width + x;
        const idWithOffset = x + y * RUN_CONFIG.width + INDEX_OFFSET;
        const writeMetadata = () => {
            const metadata = {
                name: `Doge Pixel (${x}, ${y})`,
                description: `Pixel from The Doge NFT at location (${x}, ${y})`,
                external_url: `https://pixels.thedao.ge/px/${pixelIdentifier(x, y, idWithOffset)}`,
                image: `https://ipfs.pixels.thedao.ge/ipfs/${CID_PIXELS}/pixels-sh${getShardIndex(
                    x,
                    y,
                    idWithOffset
                )}/${pixelIdentifier(x, y, idWithOffset)}.png`,
                hex: `${hex}`,
                attributes: [
                    // {
                    //     trait_type: "ID",
                    //     value: idWithOffset
                    // },
                    {
                        trait_type: "Index",
                        value: index + ""
                    },
                    {
                        trait_type: "X Coordinate",
                        value: x + ""
                    },
                    {
                        trait_type: "Y Coordinate",
                        value: y + ""
                    },
                    {
                        trait_type: "Hex",
                        value: `${hex}`
                    },
                ]
            };
            // console.log(`[${x}][${y}]: ${hex}; ${hexIntToRgba(hexInt)}`)
            mkdir(
                path.join(
                    METADATA_PATH,
                    `metadata-sh${getShardIndex(x, y, idWithOffset)}`
                ));
            fs.writeFileSync(
                path.join(
                    METADATA_PATH,
                    `metadata-sh${getShardIndex(x, y, idWithOffset)}`,
                    `metadata-${pixelIdentifier(x, y, idWithOffset)}.json`
                ),
                JSON.stringify(metadata, null, 2)
            )

            bar1.update(y * RUN_CONFIG.width + x);
            resolve();
        }
        if (WRITE_PIXEL) {
            let image = new Jimp(size, size, function (err, image) {
                if (err) throw err;

                for (let w = 0; w < size; ++w) {
                    for (let h = 0; h < size; ++h) {
                        image.setPixelColor(hexInt, w, h);
                    }
                }
                image.write(path.join(PIXELS_PATH, `${pixelIdentifier(x, y, idWithOffset)}.png`), (err) => {
                    if (err) throw err;
                    writeMetadata();
                });
            });
        } else {
            writeMetadata();
        }
    })
    // let image = new Jimp(size, size, function (err, image) {
    //     if (err) throw err;
    //
    //     for (let w = 0; w < size; ++w) {
    //         for (let h = 0; h < size; ++h) {
    //             image.setPixelColor(hex, w, h);
    //         }
    //     }
    //
    //     image.write(`pixels/${x}_${y}.png`, (err) => {
    //         console.log(`saved ${x}_${y}.png`);
    //         if (err) throw err;
    //     });
    // });
}

function mkdir(p) {
    try {
        fs.mkdirSync(p, {recursive: true})
    } catch (e) {
        console.error(e);
    }
}

async function deploy() {
    mkdir(OUT_PATH);
    mkdir(PIXELS_PATH);
    mkdir(METADATA_PATH);
    Jimp.read(path.join(__dirname, '..', 'THE_ACTUAL_NFT_IMAGE.png'))
        .then(img => {
            const originalWidth = img.getWidth();
            const originalHeight = img.getHeight();
            let CROP_WIDTH, CROP_HEIGHT;
            if (options.crop) {
                CROP_WIDTH = Math.floor(originalWidth * options.crop);
                CROP_HEIGHT = Math.floor(originalHeight * options.crop);
            }

            const width = options.crop ? CROP_WIDTH : originalWidth;
            const height = options.crop ? CROP_HEIGHT : originalHeight;
            const config = {
                width,
                height,
                original_width: originalWidth,
                original_height: originalHeight,
                CROP_WIDTH,
                CROP_HEIGHT,
                OUT_PATH,
                options: options
            };
            fs.writeFileSync(path.join(OUT_PATH, 'config.json'), JSON.stringify(config, null, 2));
            bar1.start(config.width * config.height, 0);
            let q = [];
            const pushToQueue = async (x, y, promise) => {
                if (q.length < 20) {
                    q.push(promise);
                } else {
                    // console.log("flushing queue");
                    await Promise.all(q);
                    q = [];
                }
            }
            new Jimp(config.width, config.height, async function (err, image) {
                if (err) throw err;
                // start the progress bar with a total value of 200 and start value of 0
                for (let h = 0; h < originalHeight; ++h) {
                    for (let w = 0; w < originalWidth; ++w) {
                        if (options.crop) {
                            if (w > CROP_WIDTH || h > CROP_HEIGHT) {
                                break;
                            }
                        }
                        const hexInt = img.getPixelColor(w, h);
                        await pushToQueue(w, h, createTile(w, h, hexInt, config))
                        image.setPixelColor(hexInt, w, h);
                    }
                }
                await Promise.all(q);
                q = [];
                bar1.stop();
                console.log("Finished");
                // save in root `deploy` directory
                image.write(
                    path.join(OUT_PATH, '..', `combined-${options.deploy_id}-${getFormattedDateTime()}.png`),
                    (err) => {
                        if (err) throw err;
                    }
                );
                //save in this deployment root directory
                image.write(path.join(OUT_PATH, `combined-${getFormattedDateTime()}.png`), (err) => {
                    if (err) throw err;
                });
            });
        })
}

deploy();
