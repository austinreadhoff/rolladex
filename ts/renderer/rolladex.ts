import { ipcRenderer } from "electron";
import { setUpSaveTracking, triggerUnsafeSave } from "./save-tracker-renderer";
import { applyAllSpellTips, buildSpellRow, loadSpellData, togglePreparedSpells } from "./spells-renderer";

ipcRenderer.on('send-switch-tab', (event, tabId) => {
    switchTab(tabId);
});

document.addEventListener("DOMContentLoaded", function(){

    loadSpellData().then(() => {
        document.body.scrollTop = 0;
        
        //tabs
        document.querySelectorAll('.nav-link').forEach(tab => {
            tab.addEventListener('click', event => {
                switchTab(tab.id.substring(0, tab.id.indexOf("-tab")));
            });
        });

        //listeners for calculating ability score mods
        (document.querySelectorAll('.ability-input') as NodeListOf<HTMLInputElement>).forEach(input => {
            input.addEventListener('input', event => {
                updateAbilityMods(input.id, +input.value);
            });
        });
        document.getElementById("proficiency").addEventListener('input', event =>{
            updateAllAbilityMods();
        });
        document.getElementById("joat").addEventListener('input', event =>{
            updateAllAbilityMods();
        });
        document.querySelectorAll('.proficiency-check').forEach(checkbox => {
            checkbox.addEventListener('change', event => {
                updateAllAbilityMods();
            });
        });

        //setup and listeners for attacks
        document.getElementById("attack-stats").innerHTML = "";
        for(var i = 0; i < 5; i++){
            var attackRow = buildAttackRow();
            document.getElementById("attack-stats").appendChild(attackRow);
        }

        document.getElementById("btn-remove-attack").addEventListener('click', event =>{
            (event.target as HTMLElement).parentElement.remove();
        });
        document.getElementById("btn-add-attack").addEventListener('click', event =>{
            var attackRow = buildAttackRow();
            document.getElementById("attack-stats").appendChild(attackRow);
        });

        //listeners for counters
        document.getElementById("btn-add-counter").addEventListener('click', event =>{
            var counterBlock = buildCounterBlock();
            document.getElementById("misc-counters").appendChild(counterBlock);
        });
        
        //setup and listeners for spells
        document.querySelectorAll(".spell-block").forEach(block => {
            var spellLevel = +block.getAttribute("data-level");
    
            block.querySelector("#spells").innerHTML = "";
            block.querySelector("#spells").appendChild(buildSpellRow(spellLevel));
    
            block.querySelector("#btn-add-spell").addEventListener('click', event =>{
                block.querySelector("#spells").appendChild(buildSpellRow(spellLevel));
            });
        });

        applyAllSpellTips();

        document.getElementById("btn-reset-prepared").addEventListener('click', event => {
            (document.querySelectorAll(".spell-prepared") as NodeListOf<HTMLInputElement>).forEach(el => {
                el.checked = false;
                togglePreparedSpells();
            });
        });
    
        document.getElementById("btn-recover-slots").addEventListener('click', event => {
            document.querySelectorAll(".spell-block").forEach(block => {
                if (+block.getAttribute("data-level") > 0){
                    let remainingEl: HTMLInputElement = block.querySelector(".spell-slots-remaining")
                    let totalEl: HTMLInputElement = block.querySelector(".spell-slots-total")
                    remainingEl.value = totalEl.value;
                }
            });
        });

        setUpSaveTracking();

        ipcRenderer.send('check-recent-load');
    });
});

//#region Ability Score Logic

function updateAbilityMods(ability: string, score: number){
    var modStr = getAbililityModString(score);
    var proficientModStr = getAbililityModString(score, true);

    var joat = (document.getElementById("joat") as HTMLInputElement).checked;
    var joatModStr = getAbililityModString(score, false, true)

    document.getElementById(ability + "-mod").innerHTML = modStr;
    document.querySelectorAll('.' + ability + '-mod-prof').forEach(span =>{
        if((span.previousElementSibling as HTMLInputElement).checked)
            span.innerHTML = proficientModStr;
        else if(span.classList.contains("mod-saving"))
            span.innerHTML = modStr;
        else if (joat)
            span.innerHTML = joatModStr;
        else
            span.innerHTML = modStr;
    });
    if (ability == "dex"){
        (document.getElementById("initiative") as HTMLInputElement).value = joat ? joatModStr : modStr;
    }
}

export function updateAllAbilityMods(){
    var abilities = ["str","dex","con","int","wis","char"]
    abilities.forEach(ability =>{
        updateAbilityMods(ability, +(document.getElementById(ability) as HTMLInputElement).value);
    });
}

function getAbililityModString(abilityScore: number, applyProficiency = false, applyJoat = false){
    var proficiencyBonus = (document.getElementById("proficiency") as HTMLInputElement).value.replace(/\D/g,''); //regex for '+' characters

    var mod = calculateAbilityMod(abilityScore) 
        + (applyProficiency ? +proficiencyBonus : 0)
        + (applyJoat ? Math.floor(+proficiencyBonus/2) : 0);
    return mod < 0 ? mod.toString() : ("+" + mod);
}

function calculateAbilityMod(abilityScore: number){
    return Math.floor(abilityScore / 2) - 5;
}

//#endregion

//#region Menu Actions

export function switchTab(tabId: string){
    document.querySelectorAll('.nav-link').forEach(t => { t.classList.remove("active"); });
    document.getElementById(tabId + "-tab").classList.add("active");
    
    document.querySelectorAll('.tab-pane').forEach(t => { t.className = "tab-pane"; });
    document.querySelector("#" + tabId).className = "tab-pane show active";

    document.body.scrollTop = 0;
}

//#endregion

//#region Row builders

export function buildAttackRow(){
    var attackRowHTML = 
        `<button type="button" id="btn-remove-attack" class="col-1 btn btn-danger">-</button>
         <input class="form-control col-4 attack-stat attack-stat-name">
         <input class="form-control col-2 attack-stat attack-stat-bonus">
         <input class="form-control col-4 attack-stat attack-stat-dmg">`

    var newRow = document.createElement("div");
    newRow.className = "attack-stat-row row";
    newRow.innerHTML = attackRowHTML;
    newRow.querySelector("#btn-remove-attack").addEventListener('click', event =>{
        (event.target as HTMLElement).parentElement.remove();
        triggerUnsafeSave();
    });
    newRow.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', event => {
            triggerUnsafeSave();
        });
    });

    return newRow;
}

export function buildCounterBlock(){
    var counterHTML = 
        `<button type="button" id="btn-remove-counter" class="btn btn-danger">-</button>
        <input class="form-control misc-counter counter-name" placeholder="Custom Counter Name">
        <div class="counter-container">
            <input class="form-control misc-counter counter-current" placeholder="Current">
            <span>/</span>
            <input class="form-control misc-counter counter-max" placeholder="Max">
        </div>`

    var newCounter = document.createElement("div");
    newCounter.className = "misc-counter-block";
    newCounter.innerHTML = counterHTML;
    newCounter.querySelector("#btn-remove-counter").addEventListener('click', event =>{
        (event.target as HTMLElement).parentElement.remove();
        triggerUnsafeSave();
    });
    newCounter.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', event => {
            triggerUnsafeSave();
        });
    });

    return newCounter;
}

//#endregion