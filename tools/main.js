var Jimp = require('jimp');
var path = require('path');
const OUT_PATH = path.join(__dirname, 'ipfs-test', 'tiles-test');
function toColor(num) {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16,
        a = ((num & 0xFF000000) >>> 24) / 255;
    return "rgba(" + [r, g, b, a].join(",") + ")";
}

function createTile(x, y, hex) {
    let SIZE = 'sm';
    let size, prefix;
    if(SIZE === 'large'){
        size = 256;
    }else{
        size = 1;
    }
    prefix = '';//`tiles_${size}x${size}`
    return new Promise((resolve)=>{
        let image = new Jimp(size, size, function (err, image) {
            if (err) throw err;

            for (let w = 0; w < size; ++w) {
                for (let h = 0; h < size; ++h) {
                    image.setPixelColor(hex, w, h);
                }
            }

            image.write(path.join(OUT_PATH,prefix, `${x}_${y}.png`), (err) => {
                if (err) throw err;
                console.log(`saved ${x}_${y}.png`);
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
    //     image.write(`tiles/${x}_${y}.png`, (err) => {
    //         console.log(`saved ${x}_${y}.png`);
    //         if (err) throw err;
    //     });
    // });
}

Jimp.read('shiba.png')
    .then(img => {
        const width = img.getWidth();
        const height = img.getHeight();
        const TEST_SIZE = 50;
        let image = new Jimp(width, height, async function (err, image) {
            if (err) throw err;

            for (let h = 0; h < height; ++h) {
                for (let w = 0; w < width; ++w) {
                    if (w > TEST_SIZE || h > TEST_SIZE) {
                        break;
                    }
                    const percentage = (w + h * width) / (width * height) * 100;
                    if ((w + h * width) % 1000 == 0) {
                        console.log(percentage.toFixed(2) + '%');
                    }
                    if (percentage > 1) {
                        // break;
                    }
                    const hex = img.getPixelColor(w, h)
                    // image.setPixelColor(hex, w, h);
                    await createTile(w, h, hex);
                    // console.log(toColor(hex))
                }
            }

            image.write('test.png', (err) => {
                if (err) throw err;
            });
        });
    })
    .catch(err => {
        console.error(err);
    });
