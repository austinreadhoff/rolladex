import * as ko from "knockout";
const koMapping = require('knockout-mapping');
import { ipcRenderer } from "electron";
import { switchGame, switchTab } from "./gm";
import { gameName, jsonSchemaVersion, UpgradeSchema } from "./game-schema";
import { viewModel } from "./viewmodel";
import { IPCMessage } from "../shared/ipc-message";

ipcRenderer.on(IPCMessage.RequestSaveJson, (event: any, responseChannel: string) => {
    var json: any = {
        version: jsonSchemaVersion,
        game: gameName,
        name: viewModel.name(),
        gameType: viewModel.gameType()
    }
    //the extra .parse ensures functions are excluded
    json["initiativePCs"] = JSON.parse(ko.toJSON(viewModel.initiativePCs()));
    json["initiativeMobs"] = JSON.parse(ko.toJSON(viewModel.initiativeMobs()));
    json["tunes"] = JSON.parse(ko.toJSON(viewModel.tunes()));

    ipcRenderer.send(responseChannel, json);
});

ipcRenderer.on(IPCMessage.SendLoadedJson, (event: any, json: any) => {
    if (json["version"] < jsonSchemaVersion){
        json = UpgradeSchema(json);
    }
    
    viewModel.name(json["name"]);
    viewModel.gameType(json["gameType"]);
    koMapping.fromJS(json["initiativePCs"], {}, viewModel.initiativePCs);
    koMapping.fromJS(json["initiativeMobs"], {}, viewModel.initiativeMobs);
    koMapping.fromJS(json["tunes"], {}, viewModel.tunes);

    switchGame(viewModel.gameType());
    switchTab("game");
});