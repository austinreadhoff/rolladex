import json
import os

def del_if_exists(obj, prop):
    if prop in obj:
        del obj[prop]

def extract_from_system(obj, prop):
    if prop in obj["system"] and obj["system"][prop] is not None:
        if "value" in obj["system"][prop] and prop != "traits" and prop != "save" and prop != "area":
            obj[prop] = obj["system"][prop]["value"]
        else:
            obj[prop] = obj["system"][prop]
        
        del obj["system"][prop]

    if prop == "save" and obj["system"]["defense"] is not None and prop in obj["system"]["defense"]:
        obj[prop] = obj["system"]["defense"][prop]

    if prop == "source" and obj["system"]["publication"] is not None and "title" in obj["system"]["publication"]:
        obj[prop] = obj["system"]["publication"]["title"]

    if prop == "traditions" and obj ["system"]["traits"]["traditions"] is not None:
        obj[prop] = obj["system"]["traits"][prop]

input_dir = "input"
output_file = "output/output.json"
spells = json.loads("[]")

print("processing...")
for filename in os.listdir(input_dir):
    f = os.path.join(input_dir,filename)
    fd = open(f, 'r')
    spell = json.load(fd)
    
    #spell["category"] = "ritual"
    #spell["category"] = "focus"
    spell["category"] = "spell"
    del_if_exists(spell,"_id")
    del_if_exists(spell,"img")
    del_if_exists(spell,"type")
    del_if_exists(spell,"folder")

    extract_from_system(spell, "area")
    extract_from_system(spell, "category")
    extract_from_system(spell, "cost")
    extract_from_system(spell, "description")
    extract_from_system(spell, "duration")
    extract_from_system(spell, "level")
    extract_from_system(spell, "materials")
    extract_from_system(spell, "primarycheck")
    extract_from_system(spell, "range")
    extract_from_system(spell, "save")
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
