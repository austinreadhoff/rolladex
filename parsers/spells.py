import json
import os

def del_if_exists(obj, prop):
    if prop in obj:
        del obj[prop]

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
    del_if_exists(spell["system"],"ability")
    del_if_exists(spell["system"],"area")
    del_if_exists(spell["system"],"areasize")
    del_if_exists(spell["system"],"cost")
    del_if_exists(spell["system"],"damage")
    del_if_exists(spell["system"],"hasCounteractCheck")
    del_if_exists(spell["system"],"overlays")
    del_if_exists(spell["system"],"prepared")
    del_if_exists(spell["system"],"primarycheck")
    del_if_exists(spell["system"],"rules")
    del_if_exists(spell["system"],"save")
    del_if_exists(spell["system"],"secondarycasters")
    del_if_exists(spell["system"],"secondarycheck")
    del_if_exists(spell["system"],"spellType")
    del_if_exists(spell["system"],"sustained")
    
    spells.append(spell)

spells.sort(key = lambda s: s["name"])
output = open(output_file, 'w')
json.dump(spells, output)
print("done")
