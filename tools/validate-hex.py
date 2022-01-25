from PIL import Image
import json
import math
import PIL
img = Image.open('../THE_ACTUAL_NFT_IMAGE.png')
pixels = img.load()
width, height = img.size
if width != 640:
    raise Exception("Wrong width")
if height != 480:
    raise Exception("Wrong height")
for x in range(width):
    for y in range(height):
        vals = pixels[x, y]
        if len(vals) > 3:
            if vals[3] != 255:
                raise Exception("Alpha should always be 255")
        r, g, b = vals
        hex=f"#{r:02x}{g:02x}{b:02x}"
        index=x+y*640
        shard=1+math.floor(index/5000)
        img_file = PIL.Image.open(f'./validate/validate/QmWCooiMeDPknGufpdTb1xPGH5FgfyS6p8gyTJHcnN1Pwh/pixels-sh{shard}/{1000000+index}.png')
        rgb_pixel_value = img_file.getpixel((175, 175))
        if r != rgb_pixel_value[0] or g != rgb_pixel_value[1] or b != rgb_pixel_value[2]:
            raise Exception(f"{x}, {y} -> FAIL: ({r}, {g}, {b}) != {rgb_pixel_value}")
        print(f"{x}, {y}; ({r}, {g}, {b}) = {rgb_pixel_value}")
        # with open(f'./validate/{CID}/me') as f:
        #     d = json.load(f)
        #     if d["hex"] != hex:
        #         raise Exception(f"{x}, {y} -> FAIL {d['hex']} != {hex}")
        #     else:
        #         print(f"{x},{y} -> OK")
