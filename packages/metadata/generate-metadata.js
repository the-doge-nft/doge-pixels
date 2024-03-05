const jimp = require("jimp");
const path = require("path");

const INDEX_OFFSET = 1000000;

function hexIntToStr(hex) {
  const rgba = jimp.intToRGBA(hex);
  const r = rgba.r.toString(16).padStart(2, 0);
  const g = rgba.g.toString(16).padStart(2, 0);
  const b = rgba.b.toString(16).padStart(2, 0);
  if (rgba.a !== 255) {
    throw "A not 255";
  }
  return `#${r}${g}${b}`;
}

async function main() {
  return jimp
    .read(path.join(__dirname, "..", "..", "THE_ACTUAL_NFT_IMAGE.png"))
    .then((img) => {
      const width = img.getWidth();
      const height = img.getHeight();
      console.log("width: ", width);
      console.log("height: ", height);

      for (let w = 0; w < width; ++w) {
        for (let h = 0; h < height; ++h) {
          const color = img.getPixelColor(w, h);
          const hex = hexIntToStr(color);
          const id = w + h * width + INDEX_OFFSET;
          const index = h * width + w;

          const metadata = {
            name: `Doge Pixel (${w}, ${h})`,
            description: `Pixel from The Doge NFT at location (${w}, ${h})`,
            external_url: `https://pixels.ownthedoge.com/px/${id}`,
            image: `https://api.pixels.ownthedoge.com/pixels/${id}.png`,
            attributes: [
              { trait_type: "Index", value: index },
              { trait_type: "X Coordinate", value: w },
              { trait_type: "Y Coordinate", value: h },
              { trait_type: "Hex", value: `${hex}` },
            ],
            hex,
          };
          console.log(metadata);
        }
      }
    });
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
