import json
import os

def del_if_exists(obj, prop):
    if prop in obj:
        del obj[prop]

def extract_from_system(obj, prop):
    if prop in obj["system"] and  isinstance(obj["system"][prop], int):
        obj[prop] = obj["system"][prop]

    elif prop in obj["system"] and obj["system"][prop] is not None:
        if "value" in obj["system"][prop] and prop != "traits" and prop != "damage" and prop != "hp":
            obj[prop] = obj["system"][prop]["value"]
        else:
            obj[prop] = obj["system"][prop]
        
        del obj["system"][prop]

input_dir = "input"
output_file = "output/output.json"
equipment = json.loads("[]")

print("processing...")
for filename in os.listdir(input_dir):
    f = os.path.join(input_dir,filename)
    fd = open(f, 'r')
    gear = json.load(fd)
    
    del_if_exists(gear,"_id")
    del_if_exists(gear,"img")
    del_if_exists(gear,"type")

    extract_from_system(gear, "armor")
    extract_from_system(gear, "baseItem")
    extract_from_system(gear, "category")
    extract_from_system(gear, "check")
    extract_from_system(gear, "damage")
    extract_from_system(gear, "dex")
    extract_from_system(gear, "description")
    extract_from_system(gear, "group")
    extract_from_system(gear, "hardness")
    extract_from_system(gear, "hp")
    extract_from_system(gear, "level")
    extract_from_system(gear, "price")
    extract_from_system(gear, "source")
    extract_from_system(gear, "strength")
    extract_from_system(gear, "speed")
    extract_from_system(gear, "traits")
    extract_from_system(gear, "usage")
    extract_from_system(gear, "weight")

    del gear["system"]
    equipment.append(gear)

equipment.sort(key = lambda s: s["name"])
output = open(output_file, 'w')
json.dump(equipment, output)
print("done")
