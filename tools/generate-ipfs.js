const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');
const commandLineArgs = require('command-line-args');
const cliProgress = require('cli-progress');
const optionDefinitions = [
    // {name: 'deploy_id', type: String},
    {name: 'tile_size', type: Number, defaultValue: 1},
    {name: 'deploy_dir', type: String},
    {name: 'ipns_dir', type: String},
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
const IPNS_DIR = options.ipns_dir;

// create a new progress bar instance and use shades_classic theme
const bar1 = new cliProgress.SingleBar(
    {
        format: 'progress [{bar}] {percentage}% | {duration_formatted} | {value}/{total} | ETA: {eta}s '
    }, cliProgress.Presets.shades_classic);

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


function pixelUrl(x, y) {
    // return `ipfs://ipns/${IPNS_DIR}/pixels/${x}_${y}.png`;
    return `https://gateway.ipfs.io/ipns/${IPNS_DIR}/pixels/${x}_${y}.png`;
}

function createTile(x, y, hexInt, RUN_CONFIG) {
    let SIZE = 'sm';
    let size, prefix;
    const hex = hexIntToStr(hexInt);
    size = options.tile_size;
    prefix = '';//`pixels_${size}x${size}`
    return new Promise((resolve) => {
        let image = new Jimp(size, size, function (err, image) {
            if (err) throw err;

            for (let w = 0; w < size; ++w) {
                for (let h = 0; h < size; ++h) {
                    image.setPixelColor(hexInt, w, h);
                }
            }

            image.write(path.join(PIXELS_PATH, `${x}_${y}.png`), (err) => {
                if (err) throw err;
                // console.log(`saved ${x}_${y}.png`);
                const index = y * RUN_CONFIG.width + x;
                const metadata = {
                    name: `$DOG[${x}][${y}]`,
                    description: `Hi I'm $DOG[${x}][${y}]`,
                    // external_url: `https://squeamish-side.surge.sh/${index}/${index}/${index}/${index}/${index}/${index}/${index}/${index}`,
                    image: pixelUrl(x, y),
                    hex: `${hex}`,
                    // background_color: '#fff',//todo: select contrast
                    attributes: [
                        // {
                        //     trait_type: "REGION",
                        //     value: "n/a"
                        // },
                        {
                            trait_type: "XCOORD",
                            value: x
                        },
                        {
                            trait_type: "YCOORD",
                            value: y
                        },
                        {
                            trait_type: "INDEX",
                            value: index
                        },
                        {
                            trait_type: "HEX",
                            value: `${hex}`
                        },
                        // {
                        //     trait_type: "RGBA",
                        //     value: toColor(hex)
                        // },
                        {
                            trait_type: "DENSITY",
                            value: "DENSE"
                        },
                    ]
                };
                // console.log(`[${x}][${y}]: ${hex}; ${hexIntToRgba(hexInt)}`)
                fs.writeFileSync(path.join(METADATA_PATH, `metadata-${x}_${y}.json`), JSON.stringify(metadata, null, 2))

                bar1.update(y * RUN_CONFIG.width + x);
                resolve();
            });
        });
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

                image.write('test.png', (err) => {
                    if (err) throw err;
                });
            });
        })
}

deploy();
