from PIL import Image
import json
img = Image.open('../THE_ACTUAL_NFT_IMAGE.png')
pixels = img.load()
width, height = img.size

DEPLOY_ID='2021-12-01_16_55_09'
DEPLOY_ID='2022-final'

for x in range(width):
    for y in range(height):
        vals = pixels[x, y]
        if len(vals) > 3:
            if vals[3] != 255:
                raise Exception("Alpha should always be 255")
        r, g, b = vals
        hex=f"#{r:02x}{g:02x}{b:02x}"
        with open(f'./deploy/{DEPLOY_ID}/metadata/metadata-{x}_{y}.json') as f:
            d = json.load(f)
            if d["hex"] != hex:
                raise Exception(f"{x}, {y} -> FAIL {d['hex']} != {hex}")
            else:
                print(f"{x},{y} -> OK")
