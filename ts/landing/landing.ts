import { ipcRenderer } from "electron";

document.addEventListener("DOMContentLoaded", function(){
    ipcRenderer.send('check-recent-load');
});