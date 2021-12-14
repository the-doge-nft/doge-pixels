import json

# Opening JSON file
f = open('kobosu_colors_2.json')

# returns JSON object as
# a dictionary
data = json.load(f)

print(data[334][123])

# Closing file
f.close()