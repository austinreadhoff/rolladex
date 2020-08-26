var jsonSchemaVersion = 0.1;

ipcRenderer.on('request-save-json', (event, arg) => {
    var json = {}
    json["version"] = jsonSchemaVersion;

    document.querySelectorAll("input").forEach(el => {
        if (el.classList.contains("attack-stat") 
        || el.classList.contains("misc-counter")
        || el.classList.contains("spell-input")
        || el.classList.contains("ignore")){
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

    json["spells"] = {};
    document.querySelectorAll(".spell-block").forEach(block => {
        var spellLevel = block.dataset.level;
        var spellLevelJSON = {};

        if(spellLevel > 0){
            spellLevelJSON["spell-slots-remaining"] = block.querySelector(".spell-slots-remaining").value;
            spellLevelJSON["spell-slots-total"] = block.querySelector(".spell-slots-total").value;
        }

        spellLevelJSON["spells"] = [];
        block.querySelectorAll(".spell-row").forEach(row => {
            if(row.querySelector(".spell-name").value){
                var spellJSON = {};
    
                spellJSON["name"] = row.querySelector(".spell-name").value;
                if (spellLevel > 0){
                    spellJSON["prepared"] = row.querySelector(".spell-prepared").checked;
                }
    
                spellLevelJSON["spells"].push(spellJSON);
            }
        });

        json["spells"]["level-" + spellLevel] = spellLevelJSON;
    });

    document.title = json["character-name"] + " - RollaDex";
    ipcRenderer.send('send-save-json', json);
});

ipcRenderer.on('send-loaded-json', (event, json) => {
    document.title = json["character-name"] + " - RollaDex";

    document.querySelectorAll("input").forEach(el => {
        if (el.classList.contains("attack-stat") 
        || el.classList.contains("misc-counter")
        || el.classList.contains("spell-input")
        || el.classList.contains("ignore")){
            return;   //Handled below
        }
        if (json[el.id]){
            if (el.type == "text"){
                el.value = json[el.id];
            }
            else if (el.type == "checkbox"){
                el.checked = json[el.id];
            }
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

    for (var spellLevelName in json["spells"]){
        var spellLevel = spellLevelName.slice(-1);
        var spellLevelJSON = json["spells"][spellLevelName];
        var spellBlock = document.querySelector("[data-level='" + spellLevel + "']");

        if (spellLevel > 0){
            spellBlock.querySelector(".spell-slots-remaining").value = spellLevelJSON["spell-slots-remaining"];
            spellBlock.querySelector(".spell-slots-total").value = spellLevelJSON["spell-slots-total"];
        }

        spellBlock.querySelector("#spells").innerHTML = "";
        if (spellLevelJSON["spells"].length == 0){
            spellBlock.querySelector("#spells").appendChild(buildSpellRow(spellLevel));
        }

        spellLevelJSON["spells"].forEach(spell => {
            var spellRow = buildSpellRow(spellLevel);
            spellRow.querySelector(".spell-name").value = spell["name"];
            if (spellLevel > 0){
                spellRow.querySelector(".spell-prepared").checked = spell["prepared"];
            }
            spellBlock.querySelector("#spells").appendChild(spellRow);
        });
    }

    document.querySelectorAll("textarea").forEach(el => {
        if (json[el.id]){
            el.value = json[el.id];
        }
    });

    updateAllAbilityMods();
    togglePreparedSpells();
});