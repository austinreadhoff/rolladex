import json
import os

def del_if_exists(obj, prop):
    if prop in obj:
        del obj[prop]

def extract_from_system(obj, prop):
    if prop in obj["system"]:
        if "value" in obj["system"][prop] and prop != "traits" and prop != "save":
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

    extract_from_system(spell, "category")
    extract_from_system(spell, "cost")
    extract_from_system(spell, "components")
    extract_from_system(spell, "description")
    extract_from_system(spell, "duration")
    extract_from_system(spell, "level")
    extract_from_system(spell, "materials")
    extract_from_system(spell, "primarycheck")
    extract_from_system(spell, "range")
    extract_from_system(spell, "save")
    extract_from_system(spell, "school")
    extract_from_system(spell, "secondarycasters")
    extract_from_system(spell, "secondarycheck")
    extract_from_system(spell, "source")
    extract_from_system(spell, "target")
    extract_from_system(spell, "time")
    extract_from_system(spell, "traditions")
    extract_from_system(spell, "traits")

    del spell["system"]
    spells.append(spell)

spells.sort(key = lambda s: s["name"])
output = open(output_file, 'w')
json.dump(spells, output)
print("done")
