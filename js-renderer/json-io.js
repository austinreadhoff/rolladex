const {ipcRenderer} = require('electron')

var jsonSchemaVersion = 0.1;

ipcRenderer.on('request-save-json', (event, arg) => {
    var json = {}
    json["version"] = jsonSchemaVersion;

    document.querySelectorAll("input").forEach(el => {
        if (el.classList.contains("attack-stat") || el.classList.contains("misc-counter")){
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

    json["misc-counters"] = [];
    document.getElementById("misc-counters").querySelectorAll(".misc-counter-block").forEach(row => {
        if (row.querySelector(".counter-name").value){
            var attackJSON = {};
            attackJSON["name"] = row.querySelector(".counter-name").value;
            attackJSON["current"] = row.querySelector(".counter-current").value;
            attackJSON["max"] = row.querySelector(".counter-max").value;
            
            json["misc-counters"].push(attackJSON);
        }
    });

    ipcRenderer.send('send-save-json', json);
});

ipcRenderer.on('send-loaded-json', (event, json) => {
    document.title = json["character-name"] + " - RollaDex";

    document.querySelectorAll("input").forEach(el => {
        if (el.classList.contains("attack-stat") || el.classList.contains("misc-counter")){
            return;   //Handled below
        }
        if (el.type == "text"){
            el.value = json[el.id];
        }
        else if (el.type == "checkbox"){
            el.checked = json[el.id];
        }

    });

    document.getElementById("attack-stats").innerHTML = "";
    if (json["attack-stats"].length == 0){
        for(var i = 0; i < 5; i++){
            var attackRow = buildAttackRow();
            document.getElementById("attack-stats").appendChild(attackRow);
        }
    }
    json["attack-stats"].forEach(attack => {
        var attackRow = buildAttackRow();
        attackRow.querySelector(".attack-stat-name").value = attack["name"];
        attackRow.querySelector(".attack-stat-bonus").value = attack["bonus"];
        attackRow.querySelector(".attack-stat-dmg").value = attack["dmg"];

        document.getElementById("attack-stats").appendChild(attackRow);
    });

    document.getElementById("misc-counters").innerHTML = "";
    json["misc-counters"].forEach(counter => {
        var counterBlock = buildCounterBlock();
        counterBlock.querySelector(".counter-name").value = counter["name"];
        counterBlock.querySelector(".counter-current").value = counter["current"];
        counterBlock.querySelector(".counter-max").value = counter["max"];

        document.getElementById("misc-counters").appendChild(counterBlock);
    });

    document.querySelectorAll("textarea").forEach(el => {
        el.value = json[el.id];
    });

    updateAllAbilityMods();
});