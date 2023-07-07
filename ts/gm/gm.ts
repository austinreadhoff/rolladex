import { ipcRenderer } from "electron";
import { applyDataBinding } from "./viewmodel";

var currentTab = "dice";

ipcRenderer.on('send-switch-to-tab', (event, tabId: string) => {
    switchTab(tabId);
});

ipcRenderer.on('send-switch-tab', (event, direction: boolean) => {
    let tabs = ["dice", "iniatitive", "soundtrack"];
    let i = tabs.indexOf(currentTab);
    let tabId;
    if (direction){
        if (i == tabs.length-1)
            tabId = tabs[0];
        else
            tabId = tabs[i+1];
    }
    else{
        if (i == 0)
            tabId = tabs[tabs.length-1];
        else
            tabId = tabs[i-1];
    }

    currentTab = tabId;
    switchTab(tabId);
});

ipcRenderer.on('send-open-dice-roller', (event) => {
    let modal = document.getElementById("dice-modal");
    modal.hidden = false;
    (modal.querySelector("#txt-roller") as HTMLElement).focus();
});

document.addEventListener("DOMContentLoaded", function(){
    ipcRenderer.send('set-game-menu', "gm");
    applyDataBinding();

    document.querySelectorAll('.nav-link').forEach(tab => {
        tab.addEventListener('click', event => {
            switchTab(tab.id.substring(0, tab.id.indexOf("-tab")));
        });
    });
});

//#region Menu Actions

export function switchTab(tabId: string){
    document.querySelectorAll('.nav-link').forEach(t => { 
        t.classList.remove("active");
        t.classList.remove("down"); 
    });
    document.getElementById(tabId + "-tab").classList.add("active");
    document.getElementById(tabId + "-tab").classList.add("down");

    document.querySelectorAll('.tab-pane').forEach(t => { t.className = "tab-pane"; });
    document.querySelector("#" + tabId).className = "tab-pane active";

    document.body.scrollTop = 0;
}

//#endregion