from PIL import Image
import json

image = Image.open('../frontend/src/images/kobosu.jpeg')
pixels = image.load()
width, height = image.size

print(f"width: {width}")
print(f"height: {height}")

img = []
for y in range(height):
    img.append([])
    for x in range(width):
        r, g, b = pixels[x, y]
        hex_color = f"#{r:02x}{g:02x}{b:02x}"
        img[y].append(hex_color)

f = open("./kobosu_colors.json", "w")
f.write(json.dumps(img))
