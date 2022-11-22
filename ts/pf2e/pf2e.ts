import { ipcRenderer } from "electron";
import { Counter } from "./character";
import { loadFeatData } from "./feats";
import { loadSpellData } from "./spells";
import { applyDataBinding, viewModel } from "./viewmodel";

var currentTab = "stats";

ipcRenderer.on('send-switch-tab', (event, direction: boolean) => {
    let tabs = ["stats", "feats", "bio", "gear", "spellbook", "formulas", "featcatalog", "spellcatalog", "craftingcatalog"];
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

ipcRenderer.on('send-take-rest', (event, restType) => {
    takeRest(); //only one type of rest, doesn't matter which is sent
});

document.addEventListener("DOMContentLoaded", function(){
    applyDataBinding();

    let dataLoadingPromises = [
        loadSpellData(),
        loadFeatData()
    ];
    Promise.all(dataLoadingPromises).then(() => {
        document.querySelectorAll('.nav-link').forEach(tab => {
            tab.addEventListener('click', event => {
            switchTab(tab.id.substring(0, tab.id.indexOf("-tab")));
            });
        });
    });
});


//#region Menu Actions

export function switchTab(tabId: string){
    document.querySelectorAll('.nav-link').forEach(t => { t.classList.remove("active"); });
    document.getElementById(tabId + "-tab").classList.add("active");
    
    document.querySelectorAll('.tab-pane').forEach(t => { t.className = "tab-pane"; });
    document.querySelector("#" + tabId).className = "tab-pane show active";

    document.body.scrollTop = 0;
}

function takeRest(){
    viewModel.character().miscCounters().forEach((counter: Counter) => {
        if (counter.rest()){
            counter.current(counter.max());
        }
    });

    let character = viewModel.character();
    let currentHP = +character.currentHP();
    let hpRecovered = character.calculateModifier(+character.con())*(+character.level());
    if ((currentHP + hpRecovered) > +character.maxHP()){
        viewModel.character().currentHP(character.maxHP());
        return;
    }

    viewModel.character().currentHP((currentHP + hpRecovered).toString());
}

//#endregion
