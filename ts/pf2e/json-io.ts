import * as ko from "knockout";
const koMapping = require('knockout-mapping');
import { ipcRenderer } from "electron";
import { switchTab } from "./pf2e";
import { jsonSchemaVersion, UpgradeSchema } from "./character-schema";
import { viewModel } from "./viewmodel";
import { resetSafeSave, triggerUnsafeSave } from "../shared/save-tracker";

ipcRenderer.on('request-save-json', (event: any, arg: any) => {
    viewModel.character().version(jsonSchemaVersion);
    var json: any = JSON.parse(ko.toJSON(viewModel.character()));   //the extra .parse ensures functions are excluded

    document.title = viewModel.character().characterName() + " - RollaDex";
    ipcRenderer.send('send-save-json', json);
});

ipcRenderer.on('send-loaded-json', (event: any, json: any) => {
    if (json["version"] < jsonSchemaVersion){
        json = UpgradeSchema(json);
    }

    koMapping.fromJS(json, {}, viewModel.character);

    //fromJS will not run constructors for loaded children, and therefore save trackers will not be initiated
    //the following is a janky workaround, sorry
    document.querySelectorAll('input').forEach(input => {
        if (input.classList.contains("attack-stat")
        || input.classList.contains("misc-counter")
        || input.classList.contains("lore-field")
        || input.classList.contains("other-weapon-field")){
            input.addEventListener('input', event => {
                triggerUnsafeSave(viewModel.character().characterName());
            });
        }
        else if (input.type == "checkbox" 
        && input.classList.contains("misc-counter")){
            input.addEventListener('change', event => {
                triggerUnsafeSave(viewModel.character().characterName());
            });
        }
    });

    switchTab("stats");

    resetSafeSave(viewModel.character().characterName());
});