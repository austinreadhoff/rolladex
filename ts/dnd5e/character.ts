import * as ko from "knockout";
import { Rule } from "./rule";
import { RestType } from "../shared/rest-type";
import { viewModel } from "./viewmodel";
import { jsonSchemaVersion, gameName } from "./character-schema";

export class Character {
    version: KnockoutObservable<number>;
    game: KnockoutObservable<string>;
    characterName: KnockoutObservable<string>;
    classLevel: KnockoutObservable<string>;
    background: KnockoutObservable<string>;
    playerName: KnockoutObservable<string>;
    race: KnockoutObservable<string>;
    alignment: KnockoutObservable<string>;
    xp: KnockoutObservable<string>;
    str: KnockoutObservable<string>;
    dex: KnockoutObservable<string>;
    con: KnockoutObservable<string>;
    int: KnockoutObservable<string>;
    wis: KnockoutObservable<string>;
    char: KnockoutObservable<string>;
    inspiration: KnockoutObservable<boolean>;
    proficiency: KnockoutObservable<string>;
    rules: KnockoutObservable<Rules>;
    savingStr: KnockoutObservable<boolean>;
    savingDex: KnockoutObservable<boolean>;
    savingCon: KnockoutObservable<boolean>;
    savingInt: KnockoutObservable<boolean>;
    savingWis: KnockoutObservable<boolean>;
    savingChar: KnockoutObservable<boolean>;
    armorClass: KnockoutObservable<string>;
    speed: KnockoutObservable<string>;
    currentHP: KnockoutObservable<string>;
    maxHP: KnockoutObservable<string>;
    tempHP: KnockoutObservable<string>;
    currentHitDice: KnockoutObservable<string>;
    maxHitDice: KnockoutObservable<string>;
    deathSavingSuccess1: KnockoutObservable<boolean>;
    deathSavingSuccess2: KnockoutObservable<boolean>;
    deathSavingSuccess3: KnockoutObservable<boolean>;
    deathSavingFailure1: KnockoutObservable<boolean>;
    deathSavingFailure2: KnockoutObservable<boolean>;
    deathSavingFailure3: KnockoutObservable<boolean>;
    copper: KnockoutObservable<string>;
    silver: KnockoutObservable<string>;
    electrum: KnockoutObservable<string>;
    gold: KnockoutObservable<string>;
    platinum: KnockoutObservable<string>;
    age: KnockoutObservable<string>;
    height: KnockoutObservable<string>;
    weight: KnockoutObservable<string>;
    eyes: KnockoutObservable<string>;
    skin: KnockoutObservable<string>;
    hair: KnockoutObservable<string>;
    proficienciesLanguages: KnockoutObservable<string>;
    equipment: KnockoutObservable<string>;
    features: KnockoutObservable<string>;
    physicalDescription: KnockoutObservable<string>;
    traits: KnockoutObservable<string>;
    ideals: KnockoutObservable<string>;
    bonds: KnockoutObservable<string>;
    flaws: KnockoutObservable<string>;
    backstory: KnockoutObservable<string>;
    allies: KnockoutObservable<string>;
    additionalFeatures: KnockoutObservable<string>;
    treasure: KnockoutObservable<string>;
    acrobatics: KnockoutObservable<string>;
    animalHandling: KnockoutObservable<string>;
    arcana: KnockoutObservable<string>;
    athletics: KnockoutObservable<string>;
    deception: KnockoutObservable<string>;
    history: KnockoutObservable<string>;
    insight: KnockoutObservable<string>;
    intimidation: KnockoutObservable<string>;
    investigation: KnockoutObservable<string>;
    medicine: KnockoutObservable<string>;
    nature: KnockoutObservable<string>;
    perception: KnockoutObservable<string>;
    performance: KnockoutObservable<string>;
    persuasion: KnockoutObservable<string>;
    religion: KnockoutObservable<string>;
    slightOfHand: KnockoutObservable<string>;
    stealth: KnockoutObservable<string>;
    survival: KnockoutObservable<string>;
    attackStats: KnockoutObservableArray<Attack>;
    miscCounters: KnockoutObservableArray<Counter>;
    spellcastingClasses: KnockoutObservableArray<SpellcastingClass>;
    spellLevels: KnockoutObservableArray<SpellLevel>;

    constructor(){
        this.version = ko.observable(jsonSchemaVersion);
        this.game = ko.observable(gameName);
        this.characterName = ko.observable("");
        this.classLevel = ko.observable("");
        this.background = ko.observable("");
        this.playerName = ko.observable("");
        this.race = ko.observable("");
        this.alignment = ko.observable("");
        this.xp = ko.observable("");
        this.str = ko.observable("");
        this.dex = ko.observable("");
        this.con = ko.observable("");
        this.int = ko.observable("");
        this.wis = ko.observable("");
        this.char = ko.observable("");
        this.inspiration = ko.observable(false);
        this.proficiency = ko.observable("");
        this.rules = ko.observable(new Rules());
        this.savingStr = ko.observable(false);
        this.savingDex = ko.observable(false);
        this.savingCon = ko.observable(false);
        this.savingInt = ko.observable(false);
        this.savingWis = ko.observable(false);
        this.savingChar = ko.observable(false);
        this.armorClass = ko.observable("");
        this.speed = ko.observable("");
        this.currentHP = ko.observable("");
        this.maxHP = ko.observable("");
        this.tempHP = ko.observable("");
        this.currentHitDice = ko.observable("");
        this.maxHitDice = ko.observable("");
        this.deathSavingSuccess1 = ko.observable(false);
        this.deathSavingSuccess2 = ko.observable(false);
        this.deathSavingSuccess3 = ko.observable(false);
        this.deathSavingFailure1 = ko.observable(false);
        this.deathSavingFailure2 = ko.observable(false);
        this.deathSavingFailure3 = ko.observable(false);
        this.copper = ko.observable("");
        this.silver = ko.observable("");
        this.electrum = ko.observable("");
        this.gold = ko.observable("");
        this.platinum = ko.observable("");
        this.age = ko.observable("");
        this.height = ko.observable("");
        this.weight = ko.observable("");
        this.eyes = ko.observable("");
        this.skin = ko.observable("");
        this.hair = ko.observable("");
        this.proficienciesLanguages = ko.observable("");
        this.equipment = ko.observable("");
        this.features = ko.observable("");
        this.physicalDescription = ko.observable("");
        this.traits = ko.observable("");
        this.ideals = ko.observable("");
        this.bonds = ko.observable("");
        this.flaws = ko.observable("");
        this.backstory = ko.observable("");
        this.allies = ko.observable("");
        this.additionalFeatures = ko.observable("");
        this.treasure = ko.observable("");
        this.acrobatics = ko.observable("&nbsp");
        this.animalHandling = ko.observable("&nbsp");
        this.arcana = ko.observable("&nbsp");
        this.athletics = ko.observable("&nbsp");
        this.deception = ko.observable("&nbsp");
        this.history = ko.observable("&nbsp");
        this.insight = ko.observable("&nbsp");
        this.intimidation = ko.observable("&nbsp");
        this.investigation = ko.observable("&nbsp");
        this.medicine = ko.observable("&nbsp");
        this.nature = ko.observable("&nbsp");
        this.perception = ko.observable("&nbsp");
        this.performance = ko.observable("&nbsp");
        this.persuasion = ko.observable("&nbsp");
        this.religion = ko.observable("&nbsp");
        this.slightOfHand = ko.observable("&nbsp");
        this.stealth = ko.observable("&nbsp");
        this.survival = ko.observable("&nbsp");
        this.attackStats = ko.observableArray([new Attack()]);
        this.miscCounters = ko.observableArray([]);
        this.spellcastingClasses = ko.observableArray([new SpellcastingClass()]);
        this.spellLevels = ko.observableArray([]);

        for (var i = 0; i <= 9; i++){
            this.spellLevels.push(new SpellLevel(i))
        }

        this.characterName.subscribe(function(){document.title = viewModel.character().characterName() + " - Rolladex"});
    }

    savingThrowCheckbox(ability: number, hasProf: Boolean){
        let profString = hasProf ? "P" : "&nbsp";
        return this.abilityMod(ability, [7], profString);
    }

    abilityMod(ability: number, rulesApplied: number[] = [], p = "&nbsp"){
        return ko.computed(() =>{
            //there's some strange behavior w/ ko.computed functions, need this to be declared inside here, so it can be modified by Rules
            var profString = p;

            if (!ability) return "+0";

            let profBonus = this.proficiency();
            if (profBonus.length == 0 || (profBonus.length > 0 && profBonus[0] == '-'))
                profBonus = "0";
            else
                profBonus = this.proficiency().replace(/\D/g,'');

            if (rulesApplied.includes(Rule.Harengon) && this.rules().harengon() && profString == "&nbsp")
                profString = "P"
            if (rulesApplied.includes(Rule.AuraSentinel) && this.rules().auraSentinel() && profString == "&nbsp")
                profString = "P"
            
            let profLevel: number;
            if (profString == "&nbsp")
                profLevel = 0;
            else if (profString == "P")
                profLevel = 1;
            else if (profString == "E")
                profLevel = 2;

            let mod = Math.floor(+ability / 2) - 5
                + (profLevel * +profBonus);

            if (rulesApplied.includes(Rule.JackOfAllTrades) && this.rules().jackOfAllTrades() && profString == "&nbsp"){
                mod += Math.floor(+profBonus/2);
            }
            else if (rulesApplied.includes(Rule.RemarkableAthlete) && this.rules().remarkableAthlete() && profString == "&nbsp"){
                mod += Math.floor(+profBonus/2);
            }

            if ((rulesApplied.includes(Rule.ElegantCourtier) && this.rules().elegantCourtier()) 
                || (rulesApplied.includes(Rule.OtherworldlyGlamour) && this.rules().otherworldlyGlamour())){
                let wis = this.calculateAbilityBonus("WIS", false);
                mod += wis < 0 ? 0 : wis;
            }

            if ((rulesApplied.includes(Rule.RakishAudacity) && this.rules().rakishAudacity()) ||
                (rulesApplied.includes(Rule.AuraProtection) && this.rules().auraProtection())){
                let cha = this.calculateAbilityBonus("CHAR", false);
                mod += cha < 0 ? 0 : cha;
            }

            if (rulesApplied.includes(Rule.Alert) && this.rules().alert()){
                mod += 5;
            }

            if (!mod) return "+0";
            return mod < 0 ? mod.toString() : ("+" + mod);
        }, this);
    }

    //because calculated properties can't be math'd
    private calculateAbilityBonus(ability: string, proficient: boolean) : number {
        let abilityScore;
        switch(ability){
            case "STR":
            abilityScore = this.str();
            break;
            case "DEX":
            abilityScore = this.dex();
            break;
            case "CON":
            abilityScore = this.con();
            break;
            case "INT":
            abilityScore = this.int();
            break;
            case "WIS":
            abilityScore = this.wis();
            break;
            case "CHAR":
            abilityScore = this.char();
            break;
        }

        if (!abilityScore)
            return +0;

        let total = (Math.floor(+abilityScore / 2) - 5);
        if (proficient)
            return total + +(this.proficiency().replace(/\D/g,''));
        else
            return total;
    }
    
    spellAttackBonus(ability: string, bonus: string){
        return ko.computed(() => {
            let total: number = this.calculateAbilityBonus(ability, true) + +(bonus.replace(/\D/g,''));
            return total >= 0 ? "+" + total : total;
        }, this);
    }

    spellSaveDC(ability: string, bonus: string){
        return ko.computed(() => {
            let total: number = 8 + this.calculateAbilityBonus(ability, true) + +(bonus.replace(/\D/g,''));
            return total;
        }, this);
    }

    addAttackRow(){
        this.attackStats.push(new Attack())
        setTimeout(() => {
            document.getElementById("attack-modal-" + (this.attackStats().length-1).toString()).hidden = false
        }, 10); //small period to create modal
    }
    removeAttackRow(row: Attack){
        viewModel.character().attackStats.remove(row);
    }

    attackBonus(ability: string, proficient: boolean, bonus: string){
        return ko.computed(() => {
            let total: number = this.calculateAbilityBonus(ability, proficient) + +(bonus.replace(/\D/g,''));
            return total >= 0 ? "+" + total : total;
        }, this);
    }
    attackDamage(ability: string, bonus: string, dice: string, type: string){
        return ko.computed(() => {
            let total = this.calculateAbilityBonus(ability, false) + +(bonus.replace(/\D/g,''));
            return dice + (total >= 0 ? "+" : "") + total + " " + type;
        }, this);
    }

    addMiscCounter(){
        this.miscCounters.push(new Counter());
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, (50));
    }
    removeMiscCounter(counter: Counter){
        viewModel.character().miscCounters.remove(counter);
    }

    addSpellcastingClass(){
        viewModel.character().spellcastingClasses.push(new SpellcastingClass())
        setTimeout(() => {
            document.getElementById("spellcastingClass-modal-" + (viewModel.character().spellcastingClasses().length-1).toString()).hidden = false
        }, 10); //small period to create modal
    }
    removeSpellcastingClass(row: SpellcastingClass){
        viewModel.character().spellcastingClasses.remove(row);
    }

    //the following functions would be in child objects, but are here instead, to prevent functions from messing with save/load operations
    //#region
    addSpell(spellLevel: number, name: string = ""){
        this.spellLevels()[spellLevel].spells.push(new CharacterSpell(name));
        var childInputs = document
            .querySelector(".spell-block[data-level='"+spellLevel+"']")
            .querySelectorAll(".spell-name");
        (childInputs[childInputs.length - 1] as HTMLElement).focus();
    }
    removeSpell(spell: CharacterSpell, spellLevelIndex: number){
        this.spellLevels()[spellLevelIndex].spells.remove(spell);
    }
    hasSpell(name: string){
        for (let level of this.spellLevels()){
            for (let spell of level.spells()){
                if (spell.name().replace(/\[(.*?)\]|\((.*?)\)|\{(.*?)\}|\W/g, '').toUpperCase() == name.replace(/\W/g, '').toUpperCase()) return true;
            }
        }
        return false;
    }

    spellLevelFormatted(i: number){
        return ko.pureComputed(() => {
            var num = this.spellLevels()[i].level();
    
            return num == 0 ? "Cantrips" : "Level " + num;
        });
    }
    spellcastingClassLabel(i: number){
        return ko.pureComputed(() => {
            let label = "Spellcasting Class";
            if (viewModel.character().spellcastingClasses().length < 2)
                return label;
    
            return label + " " + ["A", "B", "C", "D", "E", "F"][i];
        });
    }
    spellcastingClassCssClass(i: number){
        return ko.pureComputed(() => {
            if (viewModel.character().spellcastingClasses().length < 2)
                return "";

            return "spellclassbox-" + ["a", "b", "c", "d", "e", "f"][i];
        });
    }
    spellCssClass(spellLevelIndex:number, i: number){
        return ko.pureComputed(() => {
            let spell = viewModel.character().spellLevels()[spellLevelIndex].spells()[i];

            if (spell){
                let classList = ["spell-name"];
                if (spell.prepared())
                    classList.push("prepared");
        
                if (viewModel.character().spellcastingClasses().length > 1)
                    classList.push("spellclassbox-" + spell.casterClass().toLowerCase());
        
                return classList.join(" ");
            }
        });
    } 
    //#endregion
}

class Rules {
    alert: KnockoutObservable<boolean>;
    harengon: KnockoutObservable<boolean>;
    rakishAudacity: KnockoutObservable<boolean>;
    jackOfAllTrades: KnockoutObservable<boolean>;
    remarkableAthlete: KnockoutObservable<boolean>;
    elegantCourtier: KnockoutObservable<boolean>;
    otherworldlyGlamour: KnockoutObservable<boolean>;
    auraProtection: KnockoutObservable<boolean>;
    auraSentinel: KnockoutObservable<boolean>;

    constructor(){
        this.alert = ko.observable(false);
        this.harengon = ko.observable(false);
        this.jackOfAllTrades = ko.observable(false);
        this.remarkableAthlete = ko.observable(false);
        this.elegantCourtier = ko.observable(false);
        this.otherworldlyGlamour = ko.observable(false);
        this.rakishAudacity = ko.observable(false);
        this.auraProtection = ko.observable(false);
        this.auraSentinel = ko.observable(false);
    }
}

class Attack {
    name: KnockoutObservable<string>;
    proficient: KnockoutObservable<boolean>;
    ability: KnockoutObservable<string>;
    dmgDice: KnockoutObservable<string>;
    dmgType: KnockoutObservable<string>;
    bonusAttk: KnockoutObservable<string>;
    bonusDmg: KnockoutObservable<string>;
    notes: KnockoutObservable<string>;

    constructor(){
        this.name = ko.observable("");
        this.proficient = ko.observable(false);
        this.ability = ko.observable("STR");
        this.dmgDice = ko.observable("");
        this.dmgType = ko.observable("");
        this.bonusAttk = ko.observable("0");
        this.bonusDmg = ko.observable("0");
        this.notes = ko.observable("");
    }
}

export class Counter {
    name: KnockoutObservable<string>;
    current: KnockoutObservable<string>;
    max: KnockoutObservable<string>;
    shortRest: KnockoutObservable<boolean>;
    longRest: KnockoutObservable<boolean>;

    constructor(){
        this.name = ko.observable("");
        this.current = ko.observable("");
        this.max = ko.observable("");
        this.shortRest = ko.observable(false);
        this.longRest = ko.observable(false);

        this.shortRest.subscribe((newValue: boolean) => {
            this.longRest(newValue);
        }, this);
    }
}

class SpellcastingClass {
    name: KnockoutObservable<string>;
    ability: KnockoutObservable<string>;
    bonusDC: KnockoutObservable<string>;
    bonusAttack: KnockoutObservable<string>;
    restType: KnockoutObservable<RestType>;

    constructor(){
        this.name = ko.observable("");
        this.ability = ko.observable("STR");
        this.bonusDC = ko.observable("0");
        this.bonusAttack = ko.observable("0");
        this.restType = ko.observable(RestType.Long as RestType);
    }
}

export class SpellLevel {
    level: KnockoutObservable<number>;
    slotsRemaining: KnockoutObservable<string>;
    slotsTotal: KnockoutObservable<string>;
    spells: KnockoutObservableArray<CharacterSpell>;

    constructor(level: number){
        this.level = ko.observable(level);
        this.slotsRemaining = ko.observable("0");
        this.slotsTotal = ko.observable("0");
        this.spells = ko.observableArray([]);
    }
}

export class CharacterSpell {
    name: KnockoutObservable<string>;
    prepared: KnockoutObservable<boolean>;
    casterClass: KnockoutObservable<string>;

    constructor(name: string){
        this.name = ko.observable(name);
        this.prepared = ko.observable(false);
        this.casterClass = ko.observable("A");
    }
}
