import { ipcRenderer } from "electron";

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
    });
});