import json
import os

def del_if_exists(obj, prop):
    if prop in obj:
        del obj[prop]

def extract_from_system(obj, prop):
    if prop in obj["system"]:
        if "value" in obj["system"][prop] and prop != "traits":
            obj[prop] = obj["system"][prop]["value"]
        else:
            obj[prop] = obj["system"][prop]
        
        del obj["system"][prop]

input_dir = "input"
output_file = "output/output.json"
spells = json.loads("[]")

print("processing...")
for filename in os.listdir(input_dir):
    f = os.path.join(input_dir,filename)
    fd = open(f, 'r')
    feat = json.load(fd)
    
    del_if_exists(feat,"_id")
    del_if_exists(feat,"img")
    del_if_exists(feat,"type")
    del_if_exists(feat["system"],"actionCategory")
    del_if_exists(feat["system"],"actions")
    del_if_exists(feat["system"],"frequency")
    del_if_exists(feat["system"],"rules")

    extract_from_system(feat, "actionType")
    extract_from_system(feat, "description")
    extract_from_system(feat, "featType")
    extract_from_system(feat, "level")
    extract_from_system(feat, "prerequisites")
    extract_from_system(feat, "source")
    extract_from_system(feat, "traits")

    del feat["system"]
    spells.append(feat)

spells.sort(key = lambda s: s["name"])
output = open(output_file, 'w')
json.dump(spells, output)
print("done")
