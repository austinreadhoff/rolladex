//Whenever this verison is increased, add a conversion method to the switch statement that increments the version from the previous
export var jsonSchemaVersion = 0.2;
export var gameName = "gm";

export function UpgradeSchema(json: any){
    switch (json["version"]){
        case 0.1:
            json = addNameAndGame(json);
    }

    return json;
}

function addNameAndGame(json: any){
    json["name"] = "";
    json["gameType"] = "dnd5e";

    json["version"] = "0.2"
    return json;
}