import { Game } from "../shared/game-type";

//Whenever this verison is increased, add a conversion method to the switch statement that increments the version from the previous
export var jsonSchemaVersion = 0.2;
export var gameName = Game.Pf2e;

export function UpgradeSchema(json: any){
    switch (json["version"]){
        case 0.1:
            json = removeAlignmentDeity(json);
    }

    return json;
}

function removeAlignmentDeity(json: any){
    delete json["alignment"];
    delete json["deity"];

    json["version"] = 0.2;
    return json;
}