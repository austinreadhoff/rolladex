import { ipcRenderer } from "electron";
import { Counter, CharacterSpell, SpellLevel } from "./character";
import { spellCatalogController } from "./spells";
import { applyDataBinding, viewModel } from "./viewmodel";
import { Game } from "../shared/game-type";
import { IPCMessage } from "../shared/ipc-message";

var currentTab = "stats";

ipcRenderer.on(IPCMessage.SendSwitchToTab, (event, tabId: string) => {
    switchTab(tabId);
});

ipcRenderer.on(IPCMessage.SendSwitchTab, (event, direction: boolean) => {
    let tabs = ["stats", "feats", "bio", "gear", "spellbook", "formulas", "spellcatalog"];
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

ipcRenderer.on(IPCMessage.SendTakeRest, (event, restType) => {
    takeRest(); //only one type of rest, doesn't matter which is sent
});

ipcRenderer.on(IPCMessage.SendOpenDiceRoller, (event) => {
    let modal = document.getElementById("dice-modal");
    modal.hidden = false;
});

document.addEventListener("DOMContentLoaded", function(){
    ipcRenderer.send(IPCMessage.SetGameMenu, Game.Pf2e);
    applyDataBinding();

    let dataLoadingPromises = [
        spellCatalogController.loadData(viewModel)
    ];
    Promise.all(dataLoadingPromises).then(() => {
        document.querySelectorAll('.nav-link').forEach(tab => {
            tab.addEventListener('click', event => {
            switchTab(tab.id.substring(0, tab.id.indexOf("-tab")));
            });
        });

        document.getElementById("bttn-rest").addEventListener('click', event => {
            takeRest();
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

function takeRest(){
    viewModel.character()
        .spellLevels()
        .filter(sl => +sl.level() < 11)
        .forEach((level: SpellLevel) => {
            level.slotsRemaining(level.slotsTotal());
    });

    viewModel.character()
        .spellLevels()[10]
        .spells()
        .forEach((s: CharacterSpell) => {
            s.innateCurrent(s.innateMax())
    });

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
