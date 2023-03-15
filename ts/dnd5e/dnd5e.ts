import { ipcRenderer } from "electron";
import { RestType } from "../shared/rest-type";
import { spellCatalogController } from "./spells";
import { applyDataBinding, viewModel } from "./viewmodel";
import { CharacterSpell, Counter, SpellLevel } from './character';

var currentTab = "stats";

ipcRenderer.on('send-switch-to-tab', (event, tabId: string) => {
    switchTab(tabId);
});

ipcRenderer.on('send-switch-tab', (event, direction: boolean) => {
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

ipcRenderer.on('send-take-rest', (event, restType) => {
    takeRest(restType);
});

document.addEventListener("DOMContentLoaded", function(){
    ipcRenderer.send('set-game-menu', "dnd5e");
    applyDataBinding();

    spellCatalogController.loadData().then(() => {
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
    }
}

//#endregion