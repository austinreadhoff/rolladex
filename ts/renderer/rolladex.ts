import '../util/skillbox';
import { ipcRenderer } from "electron";
import { RestType } from "../util/rest-type";
import { setUpSaveTracking, triggerUnsafeSave } from "./save-tracker-renderer";
import { applyAllSpellTips, loadSpellData, togglePreparedSpells } from "./spells-renderer";
import { applyDataBinding } from "../util/viewmodel";

//Misc TODO
//Unsafe safe logic is messed up in some way(s) or another
//Add to catalog button
//Spell CSS
//Generally use bindings instead of html references
//clean up no longer needed shit
//Fix the saving/loading of spells re: autocomplete
//Fix Spell inputs being created willy nilly or some shit

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

        applyAllSpellTips();

        (document.getElementById("spell-rest-long") as HTMLInputElement).checked = true;

        document.getElementById("btn-reset-prepared").addEventListener('click', event => {
            (document.querySelectorAll(".spell-prepared") as NodeListOf<HTMLInputElement>).forEach(el => {
                el.checked = false;
                togglePreparedSpells();
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

    let spellRest = RestType.Long;  //default to long even though the default should never be used
    (document.getElementsByName("spell-rest") as NodeListOf<HTMLInputElement>).forEach(el => {
        if (el.checked)
            spellRest = +el.value;
    });

    if (restType >= spellRest){ //Long rests refresh Warlocks too
        document.querySelectorAll(".spell-block").forEach(block => {
            if (+block.getAttribute("data-level") > 0){
                let remainingEl: HTMLInputElement = block.querySelector(".spell-slots-remaining")
                let totalEl: HTMLInputElement = block.querySelector(".spell-slots-total")
                remainingEl.value = totalEl.value;
            }
        });
    }

    document.getElementById("misc-counters").querySelectorAll(".misc-counter-block").forEach(row => {
        var currentEl: HTMLInputElement = row.querySelector(".counter-current")
        var maxEl: HTMLInputElement = row.querySelector(".counter-max")
        var shortRest: HTMLInputElement = row.querySelector(".counter-rest-short")
        var longRest: HTMLInputElement = row.querySelector(".counter-rest-long")
        if ((shortRest.checked && restType == RestType.Short) || (longRest.checked && restType == RestType.Long)){
            currentEl.value = maxEl.value;
        }
    });

    if (restType == RestType.Long){
        (document.getElementById("current-hit-dice") as HTMLInputElement).value = (document.getElementById("max-hit-dice") as HTMLInputElement).value;
        (document.getElementById("current-hp") as HTMLInputElement).value = (document.getElementById("max-hp") as HTMLInputElement).value;
        (document.getElementById("temp-hp") as HTMLInputElement).value = "";
    }
}

//#endregion