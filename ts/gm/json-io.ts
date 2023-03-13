import * as ko from "knockout";
const koMapping = require('knockout-mapping');
import { ipcRenderer } from "electron";
import { switchTab } from "./gm";
import { gameName, jsonSchemaVersion, UpgradeSchema } from "./game-schema";
import { viewModel } from "./viewmodel";

ipcRenderer.on('request-save-json', (event: any, responseChannel: string) => {
    var json: any = {
        version: jsonSchemaVersion,
        game: gameName
    }
    //the extra .parse ensures functions are excluded
    json["initiativePCs"] = JSON.parse(ko.toJSON(viewModel.initiativePCs()));
    json["initiativeMobs"] = JSON.parse(ko.toJSON(viewModel.initiativeMobs()));
    json["tunes"] = JSON.parse(ko.toJSON(viewModel.tunes()));

    ipcRenderer.send(responseChannel, json);
});

ipcRenderer.on('send-loaded-json', (event: any, json: any) => {
    if (json["version"] < jsonSchemaVersion){
        json = UpgradeSchema(json);
    }

    koMapping.fromJS(json["initiativePCs"], {}, viewModel.initiativePCs);
    koMapping.fromJS(json["initiativeMobs"], {}, viewModel.initiativeMobs);
    koMapping.fromJS(json["tunes"], {}, viewModel.tunes);

    switchTab("dice");
});