import * as ko from "knockout";
const koMapping = require('knockout-mapping');
import { ipcRenderer } from "electron";
import { switchTab } from "./rolladex";
import { applyAllSpellTips, togglePreparedSpells } from "./spells-renderer";
import { jsonSchemaVersion } from "../util/character-schema";
import { viewModel } from "../util/viewmodel";

ipcRenderer.on('request-save-json', (event: any, arg: any) => {
    viewModel.character().version(jsonSchemaVersion);
    var json: any = JSON.parse(ko.toJSON(viewModel.character()));   //the extra .parse ensures functions are excluded

    document.title = viewModel.character().characterName() + " - RollaDex";
    ipcRenderer.send('send-save-json', json);
});

ipcRenderer.on('send-loaded-json', (event: any, json: any) => {
    //TODO: This
    // if (json["version"] < jsonSchemaVersion){
    //     json = UpgradeSchema(json);
    // }

    koMapping.fromJS(json, {}, viewModel.character);

    switchTab("stats");

    document.title = viewModel.character().characterName() + " - RollaDex";

    togglePreparedSpells();
    applyAllSpellTips();
});