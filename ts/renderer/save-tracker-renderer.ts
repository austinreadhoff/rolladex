import { ipcRenderer } from "electron";
import { viewModel } from "../util/viewmodel";

export function triggerUnsafeSave(){
    document.title = "*" + viewModel.character().characterName() + " - RollaDex";
    ipcRenderer.send('update-save-safety', false);
}

export function resetSafeSave(){
    document.title = viewModel.character().characterName() + " - RollaDex";
    ipcRenderer.send('update-save-safety', true);
}