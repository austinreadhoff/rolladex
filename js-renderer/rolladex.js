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
        document.querySelectorAll('.ability-input').forEach(input => {
            input.addEventListener('input', event => {
                updateAbilityMods(input.id, input.value);
            });
        });
        document.getElementById("proficiency").addEventListener('input', event =>{
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
            event.target.parentElement.remove();
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
            var spellLevel = block.dataset.level;
    
            block.querySelector("#spells").innerHTML = "";
            block.querySelector("#spells").appendChild(buildSpellRow(spellLevel));
    
            block.querySelector("#btn-add-spell").addEventListener('click', event =>{
                block.querySelector("#spells").appendChild(buildSpellRow(spellLevel));
            });
        });

        applyAllSpellTips();
    
        document.getElementById("btn-reset-prepared").addEventListener('click', event => {
            document.querySelectorAll(".spell-prepared").forEach(el => {
                el.checked = false;
                togglePreparedSpells();
            });
        });
    
        document.getElementById("btn-recover-slots").addEventListener('click', event => {
            document.querySelectorAll(".spell-block").forEach(block => {
                if (block.dataset.level > 0){
                    block.querySelector(".spell-slots-remaining").value = block.querySelector(".spell-slots-total").value;
                }
            });
        });

        setUpSaveTracking();

        ipcRenderer.send('check-recent-load');
    });
});

//#region Ability Score Logic

function updateAbilityMods(ability, score){
    var modStr = getAbililityModString(score);
    var proficientModStr = getAbililityModString(score, true);

    document.getElementById(ability + "-mod").innerHTML = modStr;
    document.querySelectorAll('.' + ability + '-mod-prof').forEach(span =>{
        if(span.previousElementSibling.checked)
            span.innerHTML = proficientModStr;
        else
            span.innerHTML = modStr;
    });
    if (ability == "dex"){
        document.getElementById("initiative").value = modStr;
    }
}

function updateAllAbilityMods(){
    var abilities = ["str","dex","con","int","wis","char"]
    abilities.forEach(ability =>{
        updateAbilityMods(ability, document.getElementById(ability).value);
    });
}

function getAbililityModString(abilityScore, applyProficiency = false){
    var proficiencyBonus = document.getElementById("proficiency").value.replace(/\D/g,''); //regex for '+' characters

    var mod = calculateAbilityMod(abilityScore) + (applyProficiency ? +proficiencyBonus : 0);
    return mod < 0 ? mod : ("+" + mod);
}

function calculateAbilityMod(abilityScore){
    return Math.floor(abilityScore / 2) - 5;
}

//#endregion

//#region Spellbook Actions

function togglePrepared(el){
    if (el.checked){
        el.previousElementSibling.firstElementChild.classList.add("prepared");
    }
    else{
        el.previousElementSibling.firstElementChild.classList.remove("prepared");
    }
}

function togglePreparedSpells(){
    document.querySelectorAll(".spell-prepared").forEach(el => {
        togglePrepared(el);
    });
}

//#endregion

//#region Misc Utilities

function switchTab(tabId){
    document.querySelectorAll('.nav-link').forEach(t => { t.classList.remove("active"); });
    document.getElementById(tabId + "-tab").classList.add("active");
    
    document.querySelectorAll('.tab-pane').forEach(t => { t.className = "tab-pane"; });
    document.querySelector("#" + tabId).className = "tab-pane show active";

    document.body.scrollTop = 0;
}

function buildAttackRow(){
    var attackRowHTML = 
        `<button type="button" id="btn-remove-attack" class="col-1 btn btn-danger">-</button>
         <input class="form-control col-4 attack-stat attack-stat-name">
         <input class="form-control col-2 attack-stat attack-stat-bonus">
         <input class="form-control col-4 attack-stat attack-stat-dmg">`

    var newRow = document.createElement("div");
    newRow.className = "attack-stat-row row";
    newRow.innerHTML = attackRowHTML;
    newRow.querySelector("#btn-remove-attack").addEventListener('click', event =>{
        event.target.parentElement.remove();
        triggerUnsafeSave();
    });
    newRow.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', event => {
            triggerUnsafeSave();
        });
    });

    return newRow;
}

function buildCounterBlock(){
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
        event.target.parentElement.remove();
        triggerUnsafeSave();
    });
    newCounter.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', event => {
            triggerUnsafeSave();
        });
    });

    return newCounter;
}

function buildSpellRow(level){
    var spellHTML = 
        `<button type="button" id="btn-remove-spell" class=" col-1 btn btn-danger">-</button>
         <div class="autocomplete col"><input class="form-control spell-input spell-name"></div>`
    if(level > 0){
        spellHTML+= `<input class="col-1 spell-input spell-prepared print-hidden" type="checkbox">`
    }

    var newRow = document.createElement("div");
    newRow.className = "spell-row row";
    newRow.innerHTML = spellHTML;
    newRow.querySelector("#btn-remove-spell").addEventListener('click', event =>{
        event.target.parentElement.remove();
        triggerUnsafeSave();
    });
    if(level > 0){
        newRow.querySelector(".spell-prepared").addEventListener('click', event =>{
            togglePrepared(event.target);
            triggerUnsafeSave();
        });
    }

    newRow.querySelector(".spell-name").addEventListener('change', event =>{
        applySpellTip(event.target);
    });

    newRow.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', event => {
            triggerUnsafeSave();
        });
    });

    spellAutoComplete(newRow.querySelectorAll('.spell-name'), level);

    return newRow;
}

//#endregion