import { ipcRenderer } from "electron";
import { applyDataBinding, viewModel } from "./viewmodel";
import { spellCatalogController as spellCatalogController5e } from "../dnd5e/spells";
import { spellCatalogController as spellCatalogController2e } from "../pf2e/spells";
import { featCatalogController } from "../pf2e/feats";
import { gearCatalogController } from "../pf2e/equipment";
import { Game } from "../shared/game-type";

var currentTab = "dice";
var draggedTune = null;

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
    ipcRenderer.send('set-game-menu', Game.GM);
    applyDataBinding();

    let dataLoadingPromises = [
        spellCatalogController5e.loadData(viewModel),
        featCatalogController.loadData(viewModel),
        spellCatalogController2e.loadData(viewModel),
        gearCatalogController.loadData(viewModel)
    ]
    Promise.all(dataLoadingPromises).then(() => {
        document.body.scrollTop = 0;

        document.querySelectorAll('.nav-link').forEach(tab => {
            tab.addEventListener('click', event => {
                switchTab(tab.id.substring(0, tab.id.indexOf("-tab")));
            });
        });
        document.querySelectorAll('.nav-link-sub').forEach(tab => {
            tab.addEventListener('click', event => {
                switchTab(tab.id.substring(0, tab.id.indexOf("-tab")), "-sub");
            });
        });
        document.getElementById('gameType').addEventListener('change', function() {
            let game = (document.getElementById("gameType") as HTMLInputElement).value;
            switchGame(game);
        });
    });
});

export function switchGame(game: string){
    document.querySelectorAll('.nav-link-sub').forEach(t => { 
        t.classList.remove("active");
        t.classList.remove("down"); 
        (t as HTMLElement).style.display = "none";
    });
    document.querySelectorAll('.tab-pane-sub').forEach(t => { 
        t.classList.remove("active");
    });

    document.querySelector('.nav-link-sub.game-' + game).classList.add("active");
    document.querySelector('.nav-link-sub.game-' + game).classList.add("down");
    document.querySelectorAll('.nav-link-sub.game-' + game).forEach(t => {
        (t as HTMLElement).style.display = "inline-block";
    });

    document.querySelector('.tab-pane-sub.game-' + game).classList.add("active");
}

//#region Menu Actions

export function switchTab(tabId: string, suffix: string = ""){
    document.querySelectorAll('.nav-link' + suffix).forEach(t => { 
        t.classList.remove("active");
        t.classList.remove("down"); 
    });
    document.getElementById(tabId + "-tab").classList.add("active");
    document.getElementById(tabId + "-tab").classList.add("down");

    document.querySelectorAll('.tab-pane' + suffix).forEach(t => { t.classList.remove("active"); });
    document.querySelector("#" + tabId).classList.add("active");

    document.body.scrollTop = 0;
}

//#endregion