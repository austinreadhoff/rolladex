import { ipcRenderer } from "electron";

export function triggerUnsafeSave(characterName: string){
    document.title = "*" + characterName + " - RollaDex";
    ipcRenderer.send('update-save-safety', false);
}

export function resetSafeSave(characterName: string){
    document.title = characterName + " - RollaDex";
    ipcRenderer.send('update-save-safety', true);
}