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
    spell = json.load(fd)
    
    del_if_exists(spell,"_id")
    del_if_exists(spell,"img")
    del_if_exists(spell,"type")
    del_if_exists(spell["system"],"actionCategory")
    del_if_exists(spell["system"],"actions")
    del_if_exists(spell["system"],"frequency")
    del_if_exists(spell["system"],"rules")

    extract_from_system(spell, "actionType")
    extract_from_system(spell, "description")
    extract_from_system(spell, "featType")
    extract_from_system(spell, "level")
    extract_from_system(spell, "prerequisites")
    extract_from_system(spell, "source")
    extract_from_system(spell, "traits")

    del spell["system"]
    spells.append(spell)

spells.sort(key = lambda s: s["name"])
output = open(output_file, 'w')
json.dump(spells, output)
print("done")
