const {ipcRenderer} = require('electron')

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

    //setup and listeners for attacks
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

//#region JSON Saving/Loading

var jsonSchemaVersion = 1.0;

ipcRenderer.on('request-save-json', (event, arg) => {
    var json = {}
    json["version"] = jsonSchemaVersion;

    document.querySelectorAll("input").forEach(el => {
        if (el.classList.contains("attack-stat")){
            return;   //Handled below
        }
        if (el.type == "text"){
            json[el.id] = el.value;
        }
        else if(el.type == "checkbox"){
            json[el.id] = el.checked;
        }
    });
    document.querySelectorAll("textarea").forEach(el => {
        json[el.id] = el.value;
    });

    json["attack-stats"] = [];
    document.getElementById("attack-stats").querySelectorAll(".attack-stat-row").forEach(row => {
        if (row.querySelector(".attack-stat-name").value){
            var attackJSON = {};
            attackJSON["name"] = row.querySelector(".attack-stat-name").value;
            attackJSON["bonus"] = row.querySelector(".attack-stat-bonus").value;
            attackJSON["dmg"] = row.querySelector(".attack-stat-dmg").value;
            
            json["attack-stats"].push(attackJSON);
        }
    });


    ipcRenderer.send('send-save-json', json);
});

ipcRenderer.on('send-loaded-json', (event, json) => {
    document.querySelectorAll("input").forEach(el => {
        if (el.classList.contains("attack-stat")){
            return;   //Handled below
        }
        if (el.type == "text"){
            el.value = json[el.id];
        }
        else if (el.type == "checkbox"){
            el.checked = json[el.id];
        }

        document.getElementById("attack-stats").innerHTML = "";
        json["attack-stats"].forEach(attack => {
            var attackRow = buildAttackRow();
            attackRow.querySelector(".attack-stat-name").value = attack["name"];
            attackRow.querySelector(".attack-stat-bonus").value = attack["bonus"];
            attackRow.querySelector(".attack-stat-dmg").value = attack["dmg"];

            document.getElementById("attack-stats").appendChild(attackRow);
        });
    });
    document.querySelectorAll("textarea").forEach(el => {
        el.value = json[el.id];
    });

    updateAllAbilityMods();
});

//#endregion

//#region Misc Utilities

function buildAttackRow(){
    var attackRowHTML = 
        `<button type="button" id="btn-remove-attack" class="col-1 btn btn-danger">-</button>
         <input class="form-control col-4 attack-stat-name">
         <input class="form-control col-2 attack-stat-bonus">
         <input class="form-control col-4 attack-stat-dmg">`

    var newRow = document.createElement("div");
    newRow.className = "attack-stat-row row";
    newRow.innerHTML = attackRowHTML;
    newRow.querySelector("#btn-remove-attack").addEventListener('click', event =>{
        event.srcElement.parentElement.remove();
    });

    return newRow;
}

//#endregion