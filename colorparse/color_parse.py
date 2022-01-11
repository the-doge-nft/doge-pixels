from PIL import Image
import json

image = Image.open('../THE_ACTUAL_NFT_IMAGE.png')
pixels = image.load()
width, height = image.size

print(f"width: {width}")
print(f"height: {height}")

img = []
for y in range(height):
    img.append([])
    for x in range(width):
        r, g, b = pixels[x, y]
        if x == 334 and y == 123:
            print(r,g,b)
        hex_color = f"#{r:02x}{g:02x}{b:02x}"
        img[y].append(hex_color)

f = open("./kobosu_colors_2.json", "w")
f.write(json.dumps(img))
