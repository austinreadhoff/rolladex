import { ipcRenderer } from "electron";
import { applyDataBinding, viewModel } from "./viewmodel";

ipcRenderer.on('send-recents-json', (_, json: any) => {
    applyDataBinding(json);
});
ipcRenderer.on('send-recents-clear', () => {
    viewModel.clearRecents();
});

document.addEventListener("DOMContentLoaded", function(){
    ipcRenderer.send('check-recent-load');
    ipcRenderer.send('set-game-menu', "");

    document.addEventListener('keydown', function(event) {
        if(event.code == 'KeyD') {
            document.getElementById("dnd5e").click();
        }
        else if(event.code == 'KeyP') {
            document.getElementById("pf2e").click();
        }
        else if(event.code == 'KeyG') {
            document.getElementById("gm").click();
        }
    });
});