import * as ko from "knockout";
const koMapping = require('knockout-mapping');
import { ipcRenderer } from "electron";
import { switchTab } from "./pf2e";
import { jsonSchemaVersion, UpgradeSchema } from "./character-schema";
import { viewModel } from "./viewmodel";
import { IPCMessage } from "../shared/ipc-message";

ipcRenderer.on(IPCMessage.RequestSaveJson, (event: any, responseChannel: string) => {
    viewModel.character().version(jsonSchemaVersion);
    var json: any = JSON.parse(ko.toJSON(viewModel.character()));   //the extra .parse ensures functions are excluded

    ipcRenderer.send(responseChannel, json);
});

ipcRenderer.on(IPCMessage.SendLoadedJson, (event: any, json: any) => {
    if (json["version"] < jsonSchemaVersion){
        json = UpgradeSchema(json);
    }

    koMapping.fromJS(json, {}, viewModel.character);
    switchTab("stats");
});