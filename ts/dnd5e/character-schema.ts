import { Game } from "../shared/game-type";

//Whenever this verison is increased, add a conversion method to the switch statement that increments the version from the previous
export var jsonSchemaVersion = 0.9;
export var gameName = Game.Dnd5e;

export function UpgradeSchema(json: any){
    switch (json["version"]){
        case 0.1:
            json = ConvertProficiency(json);
        case 0.2:
            json = ConvertToViewModelSchema(json);
        case 0.3:
            json = AddGameProperty(json);
        case 0.4:
            json = RemoveSpellStats(json);
        case 0.5:
            json = MultiClassCasting(json);
        case 0.6:
            json = AttackStats(json);
        case 0.7:
            json = SpellBonuses(json);
        case 0.8:
            json = SpecialRules(json);
    }

    return json;
}

function ConvertProficiency(json: any){
    var skills = 
    ["acrobatics", "animal-handling", "arcana",
    "athletics", "deception", "history",
    "insight", "intimidation", "investigation",
    "medicine", "nature", "perception", 
    "performance", "persuasion", "religion", 
    "slight-of-hand", "stealth", "survival"];

    skills.forEach(skill => {
        json[skill] = json[skill] ? "P" : "&nbsp"
    });

    json["version"] = 0.2;
    return json;
}

function ConvertToViewModelSchema(json: any){
    let changedKeys: any = {
        "character-name": "characterName",
        "class-level": "classLevel",
        "player-name": "playerName",
        "saving-str": "savingStr",
        "saving-dex": "savingDex",
        "saving-con": "savingCon",
        "saving-int": "savingInt",
        "saving-wis": "savingWis",
        "saving-char": "savingChar",
        "armor-class": "armorClass",
        "current-hp": "currentHP",
        "max-hp": "maxHP",
        "temp-hp": "tempHP",
        "current-hit-dice": "currentHitDice",
        "max-hit-dice": "maxHitDice",
        "death-saving-success-1": "deathSavingSuccess1",
        "death-saving-success-2": "deathSavingSuccess2",
        "death-saving-success-3": "deathSavingSuccess3",
        "death-saving-failure-1": "deathSavingFailure1",
        "death-saving-failure-2": "deathSavingFailure2",
        "death-saving-failure-3": "deathSavingFailure3",
        "spellcasting-class": "spellcastingClass",
        "spellcasting-ability": "spellcastingAbility",
        "spell-save-dc": "spellSaveDC",
        "spell-attack-bonus": "spellAttackBonus",
        "proficiencies-languages": "proficienciesLanguages",
        "physical-description": "physicalDescription",
        "additional-features": "additionalFeatures",
        "animal-handling": "animalHandling",
        "slight-of-hand": "slightOfHand",
        "attack-stats": "attackStats",
        "misc-counters": "miscCounters",
        "spell-rest": "spellRest"
    }

    Object.keys(changedKeys).forEach((oldKey: string) => {
        let newKey: string = changedKeys[oldKey];
        json[newKey] = json[oldKey];
        delete json[oldKey];
    });

    json["miscCounters"].forEach((counter: any) => {
        counter["shortRest"] = counter["short-rest"];
        delete counter["short-rest"];
        counter["longRest"] = counter["long-rest"];
        delete counter["long-rest"];
    });
    
    let spellLevels: any = [];
    Object.keys(json["spells"]).forEach((level: string) => {
        if (level.indexOf("--1") == -1){ //fuck "other spells", don't want em anymore
            let oldObj: any = json["spells"][level];
            let newObj: any = {};

            newObj["level"] = +level.substring(6);   //level-x
            newObj["levelFormatted"] = (newObj["level"] == 0) ? "Cantrips" : ("Level " + newObj["level"]);
            if(+newObj["level"] > 0){
                newObj["slotsRemaining"] = oldObj["spell-slots-remaining"];
                newObj["slotsTotal"] = oldObj["spell-slots-total"];
            }
            else{
                //dummy values for cantrips
                newObj["slotsRemaining"] = "0";
                newObj["slotsTotal"] = "0";
            }
            newObj["spells"] = oldObj["spells"];
            newObj["spells"].forEach((spell: any) => {
                if (!("prepared" in spell)){
                    spell["prepared"] = false;
                }
            });

            spellLevels.push(newObj);
        }
    });
    json["spellLevels"] = spellLevels;
    delete json["spells"]

    json["version"] = 0.3;
    return json;
}

function AddGameProperty(json: any){
    json["game"] = gameName;
    json["version"] = 0.4;
    return json;
}

function RemoveSpellStats(json: any){
    delete json["spellSaveDC"];
    delete json["spellAttackBonus"];

    json["version"] = 0.5;
    return json;
}

function MultiClassCasting(json: any){
    //create single-item array from existing spellcasting class properties
    json["spellcastingClasses"] = [{
        name: json["spellcastingClass"],
        ability: json["spellcastingAbility"],
        restType: json["spellRest"],
    }];

    delete json["spellcastingClass"];
    delete json["spellcastingAbility"];
    delete json["spellRest"];

    //add caster class property to existing spells
    for (let i = 0; i < json["spellLevels"].length; i++) {
        const currentLevel = json["spellLevels"][i];
        delete currentLevel["levelFormatted"];  //unrelated fix, this should be computed, not saved

        for (let i = 0; i < currentLevel["spells"].length; i++) {
            currentLevel["spells"][i]["casterClass"] = "A";
        }
    }

    json["version"] = 0.6;
    return json;
}

function AttackStats(json: any){
    json["attackStats"].forEach((attack: any) => {
        attack["proficient"] = false;
        attack["ability"] = "STR";
        attack["dmgDice"] = "";
        attack["dmgType"] = "";
        attack["bonusAttk"] = "0";
        attack["bonusDmg"] = "0";
        attack["notes"] = "";
        delete attack["bonus"];
        delete attack["dmg"];
    });

    json["version"] = 0.7;
    return json;
}

function SpellBonuses(json: any){
    json["spellcastingClasses"].forEach((spellcastingClass: any) => {
        spellcastingClass["bonusDC"] = "0";
        spellcastingClass["bonusAttack"] = "0";
    });

    json["version"] = 0.8;
    return json;
}

function SpecialRules(json: any){
    json["rules"] = {};
    json["rules"]["jackOfAllTrades"] = json["joat"];
    json["rules"]["remarkableAthlete"] = false;
    json["rules"]["elegantCourtier"] = false;
    json["rules"]["otherworldlyGlamour"] = false;
    json["rules"]["rakishAudacity"] = false;
    
    delete json["joat"];

    json["version"] = 0.9;
    return json;
}