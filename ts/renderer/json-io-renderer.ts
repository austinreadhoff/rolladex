import { ipcRenderer } from "electron";
import { buildAttackRow, buildCounterBlock, updateAllAbilityMods, switchTab } from "./rolladex";
import { applyAllSpellTips, buildSpellRow, togglePreparedSpells } from "./spells-renderer";

var jsonSchemaVersion = 0.1;

ipcRenderer.on('request-save-json', (event: any, arg: any) => {
    var json: any = {}
    json["version"] = jsonSchemaVersion;

    document.querySelectorAll("input").forEach(el => {
        if (el.classList.contains("attack-stat") 
        || el.classList.contains("misc-counter")
        || el.classList.contains("spell-input")
        || el.classList.contains("catalog-filter")
        || el.name == "spell-rest"
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
        if (el.classList.contains("ignore")){
            return;
        }
        json[el.id] = el.value;
    });

    json["attack-stats"] = [];
    document.getElementById("attack-stats")?.querySelectorAll(".attack-stat-row").forEach(row => {
        var nameEl: HTMLInputElement = row.querySelector(".attack-stat-name");
        var bonusEl: HTMLInputElement = row.querySelector(".attack-stat-bonus");
        var dmgEl: HTMLInputElement = row.querySelector(".attack-stat-dmg");
        if (nameEl.value){
            var attackJSON: any = {};
            attackJSON["name"] = nameEl.value;
            attackJSON["bonus"] = bonusEl.value;
            attackJSON["dmg"] = dmgEl.value;
            
            json["attack-stats"].push(attackJSON);
        }
    });

    json["misc-counters"] = [];
    document.getElementById("misc-counters").querySelectorAll(".misc-counter-block").forEach(row => {
        var nameEl: HTMLInputElement = row.querySelector(".counter-name")
        var currentEl: HTMLInputElement = row.querySelector(".counter-current")
        var maxEl: HTMLInputElement = row.querySelector(".counter-max")
        var shortRest: HTMLInputElement = row.querySelector(".counter-rest-short")
        var longRest: HTMLInputElement = row.querySelector(".counter-rest-long")
        if (nameEl.value){
            var attackJSON: any = {};
            attackJSON["name"] = nameEl.value;
            attackJSON["current"] = currentEl.value;
            attackJSON["max"] = maxEl.value;
            attackJSON["short-rest"] = shortRest.checked;
            attackJSON["long-rest"] = longRest.checked;
            
            json["misc-counters"].push(attackJSON);
        }
    });

    
    (document.getElementsByName("spell-rest") as NodeListOf<HTMLInputElement>).forEach(el => {
        if (el.checked)
            json["spell-rest"] = el.value;
    });

    json["spells"] = {};
    document.querySelectorAll(".spell-block").forEach((block: any) => {
        var spellLevel = block.dataset.level;
        var spellLevelJSON: any = {};

        if(spellLevel > 0){
            spellLevelJSON["spell-slots-remaining"] = block.querySelector(".spell-slots-remaining").value;
            spellLevelJSON["spell-slots-total"] = block.querySelector(".spell-slots-total").value;
        }

        spellLevelJSON["spells"] = [];
        block.querySelectorAll(".spell-row").forEach((row: HTMLSelectElement) => {
            var nameEl: HTMLInputElement = row.querySelector(".spell-name");
            var preparedEl: HTMLInputElement = row.querySelector(".spell-prepared");
            if(nameEl.value){
                var spellJSON: any = {};
    
                spellJSON["name"] = nameEl.value;
                if (spellLevel > 0){
                    spellJSON["prepared"] = preparedEl.checked;
                }
    
                spellLevelJSON["spells"].push(spellJSON);
            }
        });

        json["spells"]["level-" + spellLevel] = spellLevelJSON;
    });

    document.title = json["character-name"] + " - RollaDex";
    ipcRenderer.send('send-save-json', json);
});

ipcRenderer.on('send-loaded-json', (event: any, json: any) => {
    switchTab("stats");

    document.title = json["character-name"] + " - RollaDex";

    document.querySelectorAll("input").forEach(el => {
        if (el.classList.contains("attack-stat") 
        || el.classList.contains("misc-counter")
        || el.classList.contains("spell-input")
        || el.classList.contains("catalog-filter")
        || el.name == "spell-rest"
        || el.classList.contains("ignore")){
            return;   //Handled below
        }
        if (json[el.id] != null){
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
    json["attack-stats"].forEach((attack: any) => {
        var attackRow = buildAttackRow();
        let nameEl: HTMLInputElement = attackRow.querySelector(".attack-stat-name")
        let bonusEl: HTMLInputElement = attackRow.querySelector(".attack-stat-bonus")
        let dmgEl: HTMLInputElement = attackRow.querySelector(".attack-stat-dmg")
        nameEl.value = attack["name"];
        bonusEl.value = attack["bonus"];
        dmgEl.value = attack["dmg"];

        document.getElementById("attack-stats").appendChild(attackRow);
    });

    document.getElementById("misc-counters").innerHTML = "";
    json["misc-counters"].forEach((counter: any) => {
        var counterBlock = buildCounterBlock();
        let nameEl: HTMLInputElement = counterBlock.querySelector(".counter-name");
        let currentEl: HTMLInputElement = counterBlock.querySelector(".counter-current");
        let maxEl: HTMLInputElement = counterBlock.querySelector(".counter-max");
        let shortRest: HTMLInputElement = counterBlock.querySelector(".counter-rest-short")
        let longRest: HTMLInputElement = counterBlock.querySelector(".counter-rest-long")
        nameEl.value = counter["name"];
        currentEl.value = counter["current"];
        maxEl.value = counter["max"];
        shortRest.checked = counter["short-rest"];
        longRest.checked = counter["long-rest"];

        if (shortRest.checked){
            longRest.disabled = true;
            longRest.checked = true;
        }

        document.getElementById("misc-counters").appendChild(counterBlock);
    });

    (document.getElementsByName("spell-rest") as NodeListOf<HTMLInputElement>).forEach(el => {
        if (el.value == json["spell-rest"])
            el.checked = true;
    });

    for (var spellLevelName in json["spells"]){
        var spellLevel: number = +spellLevelName.substr(6);  //level-
        var spellLevelJSON = json["spells"][spellLevelName];
        var spellBlock: HTMLElement = document.querySelector("[data-level='" + spellLevel + "']");

        if (spellLevel > 0){
            var remainingEl: HTMLInputElement = spellBlock.querySelector(".spell-slots-remaining")
            var totalEl: HTMLInputElement = spellBlock.querySelector(".spell-slots-total");
            remainingEl.value = spellLevelJSON["spell-slots-remaining"];
            totalEl.value = spellLevelJSON["spell-slots-total"];
        }

        spellBlock.querySelector("#spells").innerHTML = "";
        if (spellLevelJSON["spells"].length == 0){
            spellBlock.querySelector("#spells").appendChild(buildSpellRow(spellLevel));
        }

        spellLevelJSON["spells"].forEach((spell: any) => {
            var spellRow = buildSpellRow(spellLevel);
            let nameEl: HTMLInputElement = spellRow.querySelector(".spell-name")
            nameEl.value = spell["name"];
            if (spellLevel > 0){
                let preparedEl: HTMLInputElement = spellRow.querySelector(".spell-prepared")
                preparedEl.checked = spell["prepared"];
            }
            spellBlock.querySelector("#spells").appendChild(spellRow);
        });
    }

    document.querySelectorAll("textarea").forEach(el => {
        if (el.classList.contains("ignore")){
            return;
        }
        if (json[el.id] != null){
            el.value = json[el.id];
        }
    });

    updateAllAbilityMods();
    togglePreparedSpells();
    applyAllSpellTips();
});