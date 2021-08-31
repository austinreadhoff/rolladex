import * as ko from "knockout";
import { triggerUnsafeSave } from "../renderer/save-tracker-renderer";
import { UpgradeSchema } from "./character-schema";
import { RestType } from "./rest-type";
import { viewModel } from "./viewmodel";

export class Character {
    version: KnockoutObservable<number>;
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
    spellSaveDC: KnockoutObservable<string>;
    spellAttackBonus: KnockoutObservable<string>;
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

    constructor(json?: any){
        if(json === undefined){
            this.version = ko.observable(0.3);
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
            this.spellcastingAbility = ko.observable("");
            this.spellSaveDC = ko.observable("");
            this.spellAttackBonus = ko.observable("");
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
        }
        else{
            //TODO: I'm pretty sure this isn't needed at all
            json = UpgradeSchema(json);
            let parsed = JSON.parse(json);
            this.characterName = parsed.characterName;
        }
    }

    addAttackRow(){
        this.attackStats.push(new Attack())
        triggerUnsafeSave();
    }
    removeAttackRow(row: Attack){
        viewModel.character().attackStats.remove(row);
        triggerUnsafeSave();
    }

    addMiscCounter(){
        this.miscCounters.push(new Counter())
        triggerUnsafeSave();
    }
    removeMiscCounter(counter: Counter){
        viewModel.character().miscCounters.remove(counter);
        triggerUnsafeSave();
    }

    //these have to be here, otherwise the fromJS model update would bork
    addSpell(spellLevel: any){
        this.spellLevels()[spellLevel()].spells.push(new CharacterSpell());
        triggerUnsafeSave();
    }
    removeSpell(spell: CharacterSpell, spellLevel: any){
        this.spellLevels()[spellLevel()].spells.remove(spell);
        triggerUnsafeSave();
    }
}

class Attack {
    name: KnockoutObservable<string>;
    bonus: KnockoutObservable<string>;
    dmg: KnockoutObservable<string>;

    constructor(){
        this.name = ko.observable("");
        this.bonus = ko.observable("");
        this.dmg = ko.observable("");

        let savedProperties: string[] = ["name", "bonus", "dmg"];
        for(var p in savedProperties)
        {
            let propStr = savedProperties[p];
            let propName = propStr as Extract<keyof this, string>;
            if(this.hasOwnProperty(propStr)) {
                (this[propName] as any).extend({notify: "always"});
                (this[propName] as any).subscribe(function(){triggerUnsafeSave();});
            }
        }
    }
}

class Counter {
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

        let savedProperties: string[] = ["name", "current", "max", "shortRest", "longRest"];
        for(var p in savedProperties)
        {
            let propStr = savedProperties[p];
            let propName = propStr as Extract<keyof this, string>;
            if(this.hasOwnProperty(propStr)) {
                (this[propName] as any).extend({notify: "always"});
                (this[propName] as any).subscribe(function(){triggerUnsafeSave();});
            }
        }

        this.shortRest.subscribe((newValue: boolean) => {
            this.longRest(newValue);
        }, this);
    }
}

class SpellLevel {
    level: KnockoutObservable<number>;
    slotsRemaining: KnockoutObservable<string>;
    slotsTotal: KnockoutObservable<string>;
    spells: KnockoutObservableArray<CharacterSpell>;

    constructor(level: number){
        this.level = ko.observable(level);
        this.slotsRemaining = ko.observable("0");
        this.slotsTotal = ko.observable("0");
        this.spells = ko.observableArray([]);

        let savedProperties: string[] = ["slotsRemaining", "slotsTotal"];
        for(var p in savedProperties)
        {
            let propStr = savedProperties[p];
            let propName = propStr as Extract<keyof this, string>;
            if(this.hasOwnProperty(propStr)) {
                (this[propName] as any).extend({notify: "always"});
                (this[propName] as any).subscribe(function(){triggerUnsafeSave();});
            }
        }
    }

    levelFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        var num = this.level();

        return num == 0 ? "Cantrips" : "Level " + num;
    });

    // addSpell(){
    //     this.spells.push(new CharacterSpell());
    //     triggerUnsafeSave();
    // }
    // removeSpell(spell: CharacterSpell, spellLevel: any){
    //     viewModel.character().spellLevels()[spellLevel()].spells.remove(spell);
    //     triggerUnsafeSave();
    // }
}

export class CharacterSpell {
    name: KnockoutObservable<string>;
    prepared: KnockoutObservable<boolean>;

    constructor(name: string = ""){

        this.name = ko.observable(name);
        this.prepared = ko.observable(false);

        let savedProperties: string[] = ["name", "prepared", "dmg"];
        for(var p in savedProperties)
        {
            let propStr = savedProperties[p];
            let propName = propStr as Extract<keyof this, string>;
            if(this.hasOwnProperty(propStr)) {
                (this[propName] as any).extend({notify: "always"});
                (this[propName] as any).subscribe(function(){triggerUnsafeSave();});
            }
        }
    }
}