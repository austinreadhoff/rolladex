import { ipcRenderer } from "electron";
import { RestType } from "../shared/rest-type";
import { spellCatalogController } from "./spells";
import { applyDataBinding, viewModel } from "./viewmodel";
import { Counter, SpellLevel } from './character';
import { Game } from "../shared/game-type";
import { IPCMessage } from "../shared/ipc-message";

var currentTab = "stats";
var draggedAttack = null;
var draggedSpell = null;

ipcRenderer.on(IPCMessage.SendSwitchToTab, (event, tabId: string) => {
    switchTab(tabId);
});

ipcRenderer.on(IPCMessage.SendSwitchTab, (event, direction: boolean) => {
    let tabs = ["stats", "bio", "spellbook", "spellcatalog"];
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
    takeRest(restType);
});

ipcRenderer.on(IPCMessage.SendOpenDiceRoller, (event) => {
    let modal = document.getElementById("dice-modal");
    modal.hidden = false;
    (modal.querySelector("#txt-roller") as HTMLElement).focus();
});

document.addEventListener("DOMContentLoaded", function(){
    ipcRenderer.send(IPCMessage.SetGameMenu, Game.Dnd5e);
    applyDataBinding();

    spellCatalogController.loadData(viewModel).then(() => {
        document.body.scrollTop = 0;

        document.querySelectorAll('.nav-link').forEach(tab => {
            tab.addEventListener('click', event => {
                switchTab(tab.id.substring(0, tab.id.indexOf("-tab")));
            });
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

function takeRest(restType: number){
    let characterSpellRestType: RestType = RestType.Long;
    if (viewModel.character().spellcastingClasses().every(c => c.restType() == RestType.Short))
        characterSpellRestType = RestType.Short;

    if (restType >= characterSpellRestType){ //Long rests refresh Warlocks too
        viewModel.character().spellLevels().forEach((level: SpellLevel) => {
            level.slotsRemaining(level.slotsTotal());
        });
    }
    
    viewModel.character().miscCounters().forEach((counter: Counter) => {
        if ((counter.shortRest() && restType == RestType.Short) || (counter.longRest() && restType == RestType.Long)){
            counter.current(counter.max());
        }
    });

    if (restType == RestType.Long){
        viewModel.character().currentHP(viewModel.character().maxHP());
        viewModel.character().tempHP("");

        let maxHitDice = viewModel.character().maxHitDice();
        if (maxHitDice.indexOf(",") == -1       //on multiclass, let the user decide on their own which dice to regain
            && maxHitDice.indexOf("d") != -1){  //we assume the user is using xdy notation for this to work
                let max = +maxHitDice.substring(0, maxHitDice.indexOf('d'));
                let regained = Math.floor(max/2);
                if (regained < 1) regained = 1;

                let currentHitDice = viewModel.character().currentHitDice();
                let suffix = currentHitDice.substring(currentHitDice.indexOf('d'));
                let newCurrent = +currentHitDice.substring(0, currentHitDice.indexOf('d')) + regained;
                if (newCurrent > max) newCurrent = max;
                
                viewModel.character().currentHitDice(newCurrent + suffix);
        }
    }
}

//#endregion