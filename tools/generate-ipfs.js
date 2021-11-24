const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');
const commandLineArgs = require('command-line-args');
const optionDefinitions = [
    // {name: 'deploy_id', type: String},
    {name: 'tile_size', type: Number, defaultValue: 128},
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

function toColor(num) {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16,
        a = ((num & 0xFF000000) >>> 24) / 255;
    return "rgba(" + [r, g, b, a].join(", ") + ")";
}

function pixelUrl(x, y) {
    // return `ipfs://ipns/${IPNS_DIR}/pixels/${x}_${y}.png`;
    return `https://gateway.ipfs.io/ipns/${IPNS_DIR}/pixels/${x}_${y}.png`;
}

function createTile(x, y, hex, RUN_CONFIG) {
    let SIZE = 'sm';
    let size, prefix;
    size = options.tile_size;
    console.log(options);
    prefix = '';//`pixels_${size}x${size}`
    return new Promise((resolve) => {
        let image = new Jimp(size, size, function (err, image) {
            if (err) throw err;

            for (let w = 0; w < size; ++w) {
                for (let h = 0; h < size; ++h) {
                    image.setPixelColor(hex, w, h);
                }
            }

            image.write(path.join(PIXELS_PATH, `${x}_${y}.png`), (err) => {
                if (err) throw err;
                console.log(`saved ${x}_${y}.png`);
                const index = y * RUN_CONFIG.width + x;
                const metadata = {
                    name: `[${x}, ${y}]`,
                    description: `Pixel at ${x}x${y} with hex #${hex}; ${toColor(hex)}`,
                    external_url: `https://squeamish-side.surge.sh/${index}/${index}/${index}/${index}/${index}/${index}/${index}/${index}`,
                    image: pixelUrl(x, y),
                    background_color: '#fff',//todo: select contrast
                    attributes: [
                        {
                            trait_type: "REGION",
                            value: "n/a"
                        },
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
                            value: `#${hex}`
                        },
                        {
                            trait_type: "RGBA",
                            value: toColor(hex)
                        },
                        {
                            trait_type: "DENSITY",
                            value: "DENSE"
                        },
                    ]
                };
                fs.writeFileSync(path.join(METADATA_PATH, `metadata-${x}_${y}.json`), JSON.stringify(metadata, null, 2))
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
            let image = new Jimp(originalWidth, originalHeight, async function (err, image) {
                if (err) throw err;

                for (let h = 0; h < originalHeight; ++h) {
                    for (let w = 0; w < originalWidth; ++w) {
                        if (options.crop) {
                            if (w > CROP_WIDTH || h > CROP_HEIGHT) {
                                break;
                            }
                        }
                        const percentage = (w + h * originalWidth) / (originalWidth * originalHeight) * 100;
                        if ((w + h * originalWidth) % 1000 == 0) {
                            console.log(percentage.toFixed(2) + '%');
                        }
                        if (percentage > 1) {
                            // break;
                        }
                        const hex = img.getPixelColor(w, h)
                        // image.setPixelColor(hex, w, h);
                        await createTile(w, h, hex, config);
                        // console.log(toColor(hex))
                    }
                }
                // image.write('test.png', (err) => {
                //     if (err) throw err;
                // });
            });
        })
        .catch(err => {
            console.error(err);
        });
}

deploy();
