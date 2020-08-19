document.addEventListener("DOMContentLoaded", function(){

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

    //setup and listeners for attacks and counters
    document.getElementById("attack-stats").innerHTML = "";
    for(var i = 0; i < 5; i++){
        var attackRow = buildAttackRow();
        document.getElementById("attack-stats").appendChild(attackRow);
    }

    document.getElementById("btn-remove-attack").addEventListener('click', event =>{
        event.srcElement.parentElement.remove();
    });
    document.getElementById("btn-add-attack").addEventListener('click', event =>{
        var attackRow = buildAttackRow();
        document.getElementById("attack-stats").appendChild(attackRow);
    });

    document.getElementById("btn-add-counter").addEventListener('click', event =>{
        var counterBlock = buildCounterBlock();
        document.getElementById("misc-counters").appendChild(counterBlock);
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

//#region Misc Utilities

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
        event.srcElement.parentElement.remove();
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
        event.srcElement.parentElement.remove();
    });

    return newCounter;
}

//#endregion