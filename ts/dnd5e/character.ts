import * as ko from "knockout";
import { CharacterProperty } from "../shared/character-property";
import { triggerUnsafeSave } from "../shared/save-tracker";
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
    joat: KnockoutObservable<boolean>;
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
    spellcastingClass: KnockoutObservable<string>;
    spellcastingAbility: KnockoutObservable<string>;
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
    spellRest: KnockoutObservable<RestType>;
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
        this.joat = ko.observable(false);
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
        this.spellcastingClass = ko.observable("");
        this.spellcastingAbility = ko.observable("STR");
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
        this.spellRest = ko.observable(RestType.Long);
        this.spellLevels = ko.observableArray([]);

        for (var i = 0; i <= 9; i++){
            this.spellLevels.push(new SpellLevel(i))
        }

        let savedProperties: string[] = ['characterName', 'classLevel', 'background', 'playerName',
        'race', 'alignment', 'xp', 'str', 'dex', 'con', 'int', 'wis', 'char', 'inspiration', 'proficiency', 'joat',
        'savingStr', 'savingDex', 'savingCon', 'savingInt', 'savingWis', 'savingChar', 'armorClass', 'speed',
        'currentHP', 'maxHP', 'tempHP', 'currentHitDice', 'maxHitDice', 'deathSavingSuccess1', 'deathSavingSuccess2',
        'deathSavingSuccess3', 'deathSavingFailure1', 'deathSavingFailure2', 'deathSavingFailure3', 'copper',
        'silver', 'electrum', 'gold', 'platinum', 'age', 'height', 'weight', 'eyes', 'skin', 'hair',
        'spellcastingClass', 'spellcastingAbility', 'proficienciesLanguages',
        'equipment', 'features', 'physicalDescription', 'traits', 'ideals', 'bonds', 'flaws', 'backstory', 'allies',
        'additionalFeatures', 'treasure', 'acrobatics', 'animalHandling', 'arcana', 'athletics', 'deception',
        'history', 'insight', 'intimidation', 'investigation', 'medicine', 'nature', 'perception', 'performance',
        'persuasion', 'religion', 'slightOfHand', 'stealth', 'survival', 'attackStats', 'miscCounters', 'spellRest',
        'spellLevels'];
        for(var p in savedProperties)
        {
            let propStr = savedProperties[p];
            let propName = propStr as Extract<keyof this, string>;
            if(this.hasOwnProperty(propStr)) {
                (this[propName] as any).extend({notify: "always"});
                (this[propName] as any).subscribe(function(){triggerUnsafeSave(viewModel.character().characterName());});
            }
        }
    }

    abilityModCheckbox(ability: number, hasProf: Boolean, usesJoat = false){
        let profString = hasProf ? "P" : "&nbsp";
        return this.abilityMod(ability, usesJoat, profString);
    }

    abilityMod(ability: number, usesJoat = false, profString = "&nbsp"){
        return ko.computed(() =>{
            if (!ability) return "+0";

            let profBonus = this.proficiency().replace(/\D/g,'');
            let profLevel: number;
            if (profString == "&nbsp")
                profLevel = 0;
            else if (profString == "P")
                profLevel = 1;
            else if (profString == "E")
                profLevel = 2;

            let mod = Math.floor(+ability / 2) - 5
                + (profLevel * +profBonus) 
                + (usesJoat ? (this.joat() && profString == "&nbsp" ? Math.floor(+profBonus/2) : 0) : 0);
            if (!mod) return "+0";
            return mod < 0 ? mod.toString() : ("+" + mod);
        }, this);
    }

    //because calculated properties can't be math'd
    private calculateSpellAttackBonus(ability: string) : number {
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

	return (Math.floor(+abilityScore / 2) - 5)
	    + +(this.proficiency().replace(/\D/g,''));
    }
    
    spellAttackBonus(ability: string){
	return ko.computed(() => {
	    return this.calculateSpellAttackBonus(ability);
	}, this);
    }

    spellSaveDC(ability: string){
	return ko.computed(() => {
	    return 8 + this.calculateSpellAttackBonus(ability);
	}, this);
    }

    addAttackRow(){
        this.attackStats.push(new Attack())
    }
    removeAttackRow(row: Attack){
        viewModel.character().attackStats.remove(row);
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

    //these have to be here, otherwise the fromJS model update would bork
    //unsure why unsafe save needs to be triggered in these manually
    addSpell(spellLevel: number, name: string = ""){
        this.spellLevels()[spellLevel].spells.push(new CharacterSpell(name));
        triggerUnsafeSave(this.characterName());
    }
    removeSpell(spell: CharacterSpell, spellLevel: any){
        this.spellLevels()[spellLevel()].spells.remove(spell);
        triggerUnsafeSave(this.characterName());
    }
    hasSpell(name: string){
        for (let level of this.spellLevels()){
            for (let spell of level.spells()){
                if (spell.name() == name) return true;
            }
        }
        return false;
    }
}

class Attack extends CharacterProperty{
    name: KnockoutObservable<string>;
    bonus: KnockoutObservable<string>;
    dmg: KnockoutObservable<string>;

    constructor(){
        super(() => viewModel.character().characterName(), ["name", "bonus", "dmg"]);
    }
    
    initProps(){
        this.name = ko.observable("");
        this.bonus = ko.observable("");
        this.dmg = ko.observable("");
    }
}

export class Counter extends CharacterProperty {
    name: KnockoutObservable<string>;
    current: KnockoutObservable<string>;
    max: KnockoutObservable<string>;
    shortRest: KnockoutObservable<boolean>;
    longRest: KnockoutObservable<boolean>;

    constructor(){
        super(() => viewModel.character().characterName(), ["name", "current", "max", "shortRest", "longRest"]);
    }

    initProps(){
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

export class SpellLevel extends CharacterProperty {
    level: KnockoutObservable<number>;
    slotsRemaining: KnockoutObservable<string>;
    slotsTotal: KnockoutObservable<string>;
    spells: KnockoutObservableArray<CharacterSpell>;

    constructor(level: number){
        super(() => viewModel.character().characterName(), ["slotsRemaining", "slotsTotal", "spells"]);
        this.level(level);
    }

    initProps(){
        this.level = ko.observable(0);
        this.slotsRemaining = ko.observable("0");
        this.slotsTotal = ko.observable("0");
        this.spells = ko.observableArray([]);
    }

    levelFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        var num = this.level();

        return num == 0 ? "Cantrips" : "Level " + num;
    });
}

export class CharacterSpell extends CharacterProperty {
    name: KnockoutObservable<string>;
    prepared: KnockoutObservable<boolean>;

    constructor(name: string = ""){
        super(() => viewModel.character().characterName(), ["name", "prepared"]);
        this.name(name);
    }

    initProps(){
        this.name = ko.observable("");
        this.prepared = ko.observable(false);
    }
}
