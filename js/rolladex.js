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