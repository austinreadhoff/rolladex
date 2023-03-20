import * as ko from "knockout";
const koMapping = require('knockout-mapping');
import { ipcRenderer } from "electron";
import { switchTab } from "./dnd5e";
import { jsonSchemaVersion, UpgradeSchema } from "./character-schema";
import { viewModel } from "./viewmodel";

ipcRenderer.on('request-save-json', (event: any, responseChannel: string) => {
    viewModel.character().version(jsonSchemaVersion);
    var json: any = JSON.parse(ko.toJSON(viewModel.character()));   //the extra .parse ensures functions are excluded

    for (let i = 0; i < json["spellcastingClasses"].length; i++) {
        json["spellcastingClasses"][i]["restType"] = json["spellcastingClasses"][i]["restType"].toString();   //workaround, ensures enum saves as string
    }

    ipcRenderer.send(responseChannel, json);
});

ipcRenderer.on('send-loaded-json', (event: any, json: any) => {
    if (json["version"] < jsonSchemaVersion){
        json = UpgradeSchema(json);
    }

    koMapping.fromJS(json, {}, viewModel.character);
    switchTab("stats");
});