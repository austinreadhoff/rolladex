import '../util/skillbox';
import { ipcRenderer } from "electron";
import { RestType } from "../util/rest-type";
import { setUpSaveTracking, triggerUnsafeSave } from "./save-tracker-renderer";
import { loadSpellData } from "./spells-renderer";
import { applyDataBinding, viewModel } from "../util/viewmodel";
import { CharacterSpell, Counter, SpellLevel } from '../util/character';

//Misc TODO
//Unsafe safe logic is messed up in some way(s) or another

ipcRenderer.on('send-switch-tab', (event, tabId) => {
    switchTab(tabId);
});

ipcRenderer.on('send-take-rest', (event, restType) => {
    takeRest(restType);
});

document.addEventListener("DOMContentLoaded", function(){
    applyDataBinding();

    loadSpellData().then(() => {
        document.body.scrollTop = 0;
        
        //tabs
        document.querySelectorAll('.nav-link').forEach(tab => {
            tab.addEventListener('click', event => {
                switchTab(tab.id.substring(0, tab.id.indexOf("-tab")));
            });
        });

        (document.getElementById("spell-rest-long") as HTMLInputElement).checked = true;

        document.getElementById("btn-reset-prepared").addEventListener('click', event => {
            viewModel.character().spellLevels().forEach((level: SpellLevel) => {
                level.spells().forEach((spell: CharacterSpell) => {
                    spell.prepared(false);
                })
            });
        });

        setUpSaveTracking();

        ipcRenderer.send('check-recent-load');
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

function takeRest(restType: number){
    triggerUnsafeSave();

    if (restType >= viewModel.character().spellRest()){ //Long rests refresh Warlocks too
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
        viewModel.character().currentHitDice(viewModel.character().maxHitDice());
        viewModel.character().currentHP(viewModel.character().maxHP());
        viewModel.character().tempHP("");
    }
}

//#endregion