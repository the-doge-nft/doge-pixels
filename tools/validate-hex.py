from PIL import Image
import json
img = Image.open('../THE_ACTUAL_NFT_IMAGE.png')
pixels = img.load()
width, height = img.size
DEPLOY_ID='2021-11-24_18_19_14'
for y in range(height):      # this row
    for x in range(width):   # and this row was exchanged
#         r, g, b = pixels[x, y]

        print(pixels[x,y])
        # in case your image has an alpha channel
        r, g, b, a = pixels[x, y]
        hex=f"#{r:02x}{g:02x}{b:02x}{a:02x}"
        print(x, y, hex)
        with open(f'./deploy/{DEPLOY_ID}/metadata/{x}_{y}.json') as f:
            d = json.load(f)
            for attr in d["attributes"]:
                if attr["trait_type"] == "hex":
                    if attr["value"] != hex:
                        raise Exception(f"Invalid {x} {y}")
