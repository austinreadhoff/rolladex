//Whenever this verison is increased, add a conversion method to the switch statement that increments the version from the previous
export var jsonSchemaVersion = 0.2;

export function UpgradeSchema(json: any){
    switch (json["version"]){
        case 0.1:
            json = ConvertProficiency(json);
    }

    return json;
}

function ConvertProficiency(json: any){
    var skills = 
    ["acrobatics", "animal-handling", "arcana",
    "athletics", "deception", "history",
    "insight", "intimidation", "investigation",
    "medicine", "nature", "perception", 
    "performance", "persuasion", "religion", 
    "slight-of-hand", "stealth", "survival"];

    skills.forEach(skill => {
        json[skill] = json[skill] ? "P" : "&nbsp"
    });

    json["version"] = 0.2;
    return json;
}