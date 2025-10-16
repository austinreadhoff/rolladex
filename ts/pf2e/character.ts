import * as ko from "knockout";
import { viewModel } from "./viewmodel";
import { jsonSchemaVersion, gameName } from "./character-schema";
import { SpellcastingType } from "./spellcasting-type";

export class Character {
    version: KnockoutObservable<number>;
    game: KnockoutObservable<string>;
    characterName: KnockoutObservable<string>;
    playerName: KnockoutObservable<string>;
    xp: KnockoutObservable<string>;
    ancestryHeritage: KnockoutObservable<string>;
    background: KnockoutObservable<string>;
    characterClass: KnockoutObservable<string>;
    size: KnockoutObservable<string>;
    traits: KnockoutObservable<string>;
    level: KnockoutObservable<string>;
    heroPoints: KnockoutObservable<string>;

    str: KnockoutObservable<string>;
    strPartialBoost: KnockoutObservable<boolean>;
    dex: KnockoutObservable<string>;
    dexPartialBoost: KnockoutObservable<boolean>;
    con: KnockoutObservable<string>;
    conPartialBoost: KnockoutObservable<boolean>;
    int: KnockoutObservable<string>;
    intPartialBoost: KnockoutObservable<boolean>;
    wis: KnockoutObservable<string>;
    wisPartialBoost: KnockoutObservable<boolean>;
    char: KnockoutObservable<string>;
    charPartialBoost: KnockoutObservable<boolean>;

    perception: KnockoutObservable<string>;
    acrobatics: KnockoutObservable<string>;
    arcana: KnockoutObservable<string>;
    athletics: KnockoutObservable<string>;
    crafting: KnockoutObservable<string>;
    deception: KnockoutObservable<string>;
    diplomacy: KnockoutObservable<string>;
    intimidation: KnockoutObservable<string>;
    medicine: KnockoutObservable<string>;
    nature: KnockoutObservable<string>;
    occultism: KnockoutObservable<string>;
    performance: KnockoutObservable<string>;
    religion: KnockoutObservable<string>;
    society: KnockoutObservable<string>;
    stealth: KnockoutObservable<string>;
    survival: KnockoutObservable<string>;
    thievery: KnockoutObservable<string>;

    savingReflex: KnockoutObservable<string>;
    savingFort: KnockoutObservable<string>;
    savingWill: KnockoutObservable<string>;

    classDCAbility: KnockoutObservable<string>;
    classDCProficiency: KnockoutObservable<string>;

    armorClass: KnockoutObservable<string>;
    speed: KnockoutObservable<string>;

    currentHP: KnockoutObservable<string>;
    maxHP: KnockoutObservable<string>;
    tempHP: KnockoutObservable<string>;
    dying: KnockoutObservable<string>;
    wounded: KnockoutObservable<string>;
    conditions: KnockoutObservable<string>;

    armorUnarmored: KnockoutObservable<string>;
    armorLight: KnockoutObservable<string>;
    armorMedium: KnockoutObservable<string>;
    armorHeavy: KnockoutObservable<string>;

    weaponsSimple: KnockoutObservable<string>;
    weaponsMartial: KnockoutObservable<string>;
    weaponsUnarmed: KnockoutObservable<string>;

    languages: KnockoutObservable<string>;

    shieldBonus: KnockoutObservable<string>;
    shieldHardness: KnockoutObservable<string>;
    shieldCurrentHP: KnockoutObservable<string>;
    shieldMaxHP: KnockoutObservable<string>;
    shieldBT: KnockoutObservable<string>;

    ethnicity: KnockoutObservable<string>;
    nationality: KnockoutObservable<string>;
    birthplace: KnockoutObservable<string>;
    age: KnockoutObservable<string>;
    gender: KnockoutObservable<string>;
    heightWeight: KnockoutObservable<string>;
    appearance: KnockoutObservable<string>;

    attitude: KnockoutObservable<string>;
    beliefs: KnockoutObservable<string>;
    likes: KnockoutObservable<string>;
    dislikes: KnockoutObservable<string>;
    catchphrases: KnockoutObservable<string>;
    party: KnockoutObservable<string>;
    backstory: KnockoutObservable<string>;

    bulk: KnockoutObservable<string>;
    copper: KnockoutObservable<string>;
    silver: KnockoutObservable<string>;
    gold: KnockoutObservable<string>;
    platinum: KnockoutObservable<string>;
    storedMoney: KnockoutObservable<string>;
    gems: KnockoutObservable<string>;
    assets: KnockoutObservable<string>;
    itemsEquipped: KnockoutObservable<string>;
    itemsPermanent: KnockoutObservable<string>;
    itemsConsumable: KnockoutObservable<string>;

    attackStats: KnockoutObservableArray<Attack>;
    loreSkills: KnockoutObservableArray<Proficiency>;
    otherWeapons: KnockoutObservableArray<Proficiency>;
    miscCounters: KnockoutObservableArray<Counter>;

    featsFeatures: KnockoutObservable<string>;

    spellcastingTradition: KnockoutObservable<string>;
    spellcastingType: KnockoutObservable<SpellcastingType>;
    spellcastingAbility: KnockoutObservable<string>;
    spellDCProficiency: KnockoutObservable<string>;
    spellAttackProficiency: KnockoutObservable<string>;
    spellLevels: KnockoutObservableArray<SpellLevel>;

    constructor(){
        this.version = ko.observable(jsonSchemaVersion);
        this.game = ko.observable(gameName.toString());
        this.characterName = ko.observable("");
        this.playerName = ko.observable("");
        this.xp = ko.observable("");
        this.ancestryHeritage = ko.observable("");
        this.background = ko.observable("");
        this.characterClass = ko.observable("");
        this.size = ko.observable("");
        this.traits = ko.observable("");
        this.level = ko.observable("");
        this.heroPoints = ko.observable("");
        this.str = ko.observable("");
        this.strPartialBoost = ko.observable(false);
        this.dex = ko.observable("");
        this.dexPartialBoost = ko.observable(false);
        this.con = ko.observable("");
        this.conPartialBoost = ko.observable(false);
        this.int = ko.observable("");
        this.intPartialBoost = ko.observable(false);
        this.wis = ko.observable("");
        this.wisPartialBoost = ko.observable(false);
        this.char = ko.observable("");
        this.charPartialBoost = ko.observable(false);
        this.perception = ko.observable("U");
        this.acrobatics = ko.observable("U");
        this.arcana = ko.observable("U");
        this.athletics = ko.observable("U");
        this.crafting = ko.observable("U");
        this.deception = ko.observable("U");
        this.diplomacy = ko.observable("U");
        this.intimidation = ko.observable("U");
        this.medicine = ko.observable("U");
        this.nature = ko.observable("U");
        this.occultism = ko.observable("U");
        this.performance = ko.observable("U");
        this.religion = ko.observable("U");
        this.society = ko.observable("U");
        this.stealth = ko.observable("U");
        this.survival = ko.observable("U");
        this.thievery = ko.observable("U");
        this.savingReflex = ko.observable("U");
        this.savingFort = ko.observable("U");
        this.savingWill = ko.observable("U");
        this.classDCAbility = ko.observable("STR");
        this.classDCProficiency = ko.observable("U");
        this.armorClass = ko.observable("");
        this.speed = ko.observable("");
        this.currentHP = ko.observable("");
        this.maxHP = ko.observable("");
        this.tempHP = ko.observable("");
        this.dying = ko.observable("");
        this.wounded = ko.observable("");
        this.conditions = ko.observable("");
        this.armorUnarmored = ko.observable("U");
        this.armorLight = ko.observable("U");
        this.armorMedium = ko.observable("U");
        this.armorHeavy = ko.observable("U");
        this.weaponsSimple = ko.observable("U");
        this.weaponsMartial = ko.observable("U");
        this.weaponsUnarmed = ko.observable("U");
        this.languages = ko.observable("");
        this.shieldBonus = ko.observable("");
        this.shieldHardness = ko.observable("");
        this.shieldCurrentHP = ko.observable("");
        this.shieldMaxHP = ko.observable("");
        this.shieldBT = ko.observable("");
        this.appearance = ko.observable("");
        this.ethnicity = ko.observable("");
        this.nationality = ko.observable("");
        this.birthplace = ko.observable("");
        this.age = ko.observable("");
        this.gender = ko.observable("");
        this.heightWeight = ko.observable("");
        this.attitude = ko.observable("");
        this.beliefs = ko.observable("");
        this.likes = ko.observable("");
        this.dislikes = ko.observable("");
        this.catchphrases = ko.observable("");
        this.party = ko.observable("");
        this.backstory = ko.observable("");
        this.bulk = ko.observable("");
        this.copper = ko.observable("");
        this.silver = ko.observable("");
        this.gold = ko.observable("");
        this.platinum = ko.observable("");
        this.storedMoney = ko.observable("");
        this.gems = ko.observable("");
        this.assets = ko.observable("");
        this.itemsEquipped = ko.observable("");
        this.itemsPermanent = ko.observable("");
        this.itemsConsumable = ko.observable("");

        this.attackStats = ko.observableArray([new Attack()]);
        this.loreSkills = ko.observableArray([]);
        this.otherWeapons = ko.observableArray([]);
        this.miscCounters = ko.observableArray([]);

        this.featsFeatures = ko.observable("");

        this.spellcastingTradition = ko.observable("arcane");
        this.spellcastingType = ko.observable(SpellcastingType.Prepared as SpellcastingType);
        this.spellcastingAbility = ko.observable("STR");
        this.spellDCProficiency = ko.observable("U");
        this.spellAttackProficiency = ko.observable("U");
        this.spellLevels = ko.observableArray([]);

        for (var i = 1; i <= 14; i++){
            this.spellLevels.push(new SpellLevel(i));
        }

        this.characterName.subscribe(function(){document.title = viewModel.character().characterName() + " - Rolladex"});
    }

    //Returns string modifier for a given ability and prof level
    //+4, +0, -1
    abilityMod(ability: number | string, proficiencyLevel = "U"){
        if (isNaN(+ability)){
            ability = this.abilityStringToNumber(ability as string);
        }

        return ko.computed(() =>{
            let mod = this.calculateModifier(ability as number, proficiencyLevel);
            return mod < 0 ? mod.toString() : ("+" + mod);
        }, this);
    }

    //Returns DC for a given ability
    //14, 10, 9
    abilityDC(abilityStr: string, proficiencyLevel = "U"){
        return ko.computed(() =>{
            let ability: number = this.abilityStringToNumber(abilityStr);
            let mod = this.calculateModifier(ability, proficiencyLevel);
            return 10 + mod;
        }, this);
    }

    //returns number modifier for given ability and prof level
    //4, 0, -1
    calculateModifier(ability: number, proficiencyLevel = "U"): number {
        if (!ability) return 0;

        let proficiency = this.calculateProficiency(proficiencyLevel);
        let mod = +ability + proficiency;
        if (!mod) return 0;
        return mod;
    }

    //returns string for only a prof bonus, no ability attached
    //+4, +0, -1
    simpleProficiency(proficiencyLevel = "U"){
        return ko.computed(() =>{
            let proficiency = this.calculateProficiency(proficiencyLevel);
            return proficiency < 0 ? proficiency.toString() : ("+" + proficiency);
        }, this);
    }

    //returns number for only a prof bonus, no ability attached
    //4, 0, -1
    private calculateProficiency(proficiencyLevel = "U"): number {
        let proficiencyBonus: number;
        switch(proficiencyLevel) { 
            case "T": { 
                proficiencyBonus = 2 + +this.level();
                break; 
            } 
            case "E": { 
                proficiencyBonus = 4 + +this.level();
                break; 
            } 
            case "M": { 
                proficiencyBonus = 6 + +this.level();
                break; 
            } 
            case "L": { 
                proficiencyBonus = 8 + +this.level();
                break; 
            } 
            default: { 
                proficiencyBonus = 0; 
                break; 
            } 
        }

        return proficiencyBonus;
    }

    private abilityStringToNumber(abilityStr: string): number{
        let ability: number;
        switch(abilityStr.toUpperCase()) { 
            case "STR": { 
                ability = +this.str();
                break; 
            } 
            case "DEX": { 
                ability = +this.dex();
                break; 
            } 
            case "CON": { 
                ability = +this.con();
                break; 
            } 
            case "INT": { 
                ability = +this.int();
                break; 
            } 
            case "WIS": { 
                ability = +this.wis();
                break; 
            } 
            case "CHAR": { 
                ability = +this.char();
                break; 
            } 
            default: { //should never happen
                ability = +this.str(); 
                break; 
            } 
        }
        return ability;
    }

    encumberanceLimit(){
        return ko.computed(() =>{
            return 5 + this.calculateModifier(+this.str(), "U");
        }, this);
    }

    maxBulk(){
        return ko.computed(() =>{
            return 10 + this.calculateModifier(+this.str(), "U");
        }, this);
    }

    addAttackRow(){
        this.attackStats.push(new Attack())
    }
    removeAttackRow(row: Attack){
        viewModel.character().attackStats.remove(row);
    }

    addLoreSkill(){
        this.loreSkills.push(new Proficiency())
    }
    removeLoreSkill(lore: Proficiency){
        viewModel.character().loreSkills.remove(lore);
    }

    addOtherWeapon(){
        this.otherWeapons.push(new Proficiency())
    }
    removeOtherWeapon(weapon: Proficiency){
        viewModel.character().otherWeapons.remove(weapon);
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
        this.spellLevels()[spellLevel-1].spells.push(new CharacterSpell(name));
    }
    removeSpell(spell: CharacterSpell, spellLevel: any){
        this.spellLevels()[spellLevel()].spells.remove(spell);
    }
    hasSpell(name: string){
        for (let level of this.spellLevels()){
            for (let spell of level.spells()){
                if (spell.name().replace(/\[(.*?)\]|\W/g, '').toUpperCase() == name.replace(/\W/g, '').toUpperCase()) return true;
            }
        }
        return false;
    }
}

class Attack{
    name: KnockoutObservable<string>;
    bonus: KnockoutObservable<string>;
    dmg: KnockoutObservable<string>;
    traits: KnockoutObservable<string>;

    constructor(){
        this.name = ko.observable("");
        this.bonus = ko.observable("");
        this.dmg = ko.observable("");
        this.traits = ko.observable("");
    }
}

class Proficiency{
    name: KnockoutObservable<string>;
    proficiency: KnockoutObservable<string>;

    constructor(){
        this.name = ko.observable("");
        this.proficiency = ko.observable("");
    }
}

export class Counter {
    name: KnockoutObservable<string>;
    current: KnockoutObservable<string>;
    max: KnockoutObservable<string>;
    rest: KnockoutObservable<boolean>;

    constructor(){
        this.name = ko.observable("");
        this.current = ko.observable("");
        this.max = ko.observable("");
        this.rest = ko.observable(false);
    }
}

export class SpellLevel {
    level: KnockoutObservable<number>;
    slotsRemaining: KnockoutObservable<string>;
    slotsTotal: KnockoutObservable<string>;
    focusPointsRemaining: KnockoutObservable<string>;
    focusPointsTotal: KnockoutObservable<string>;
    spells: KnockoutObservableArray<CharacterSpell>;

    constructor(level: number){
        this.level = ko.observable(level);
        this.slotsRemaining = ko.observable("0");
        this.slotsTotal = ko.observable("0");
        this.focusPointsRemaining = ko.observable("0");
        this.focusPointsTotal = ko.observable("0");
        this.spells = ko.observableArray([]);
    }

    levelFormatted = ko.pureComputed(() => {
        var num = this.level();

        var display: string;
        switch(num) { 
            case 11: { 
                display = "Innate Spells";
                break; 
            } 
            case 12: { 
                display = "Cantrips (Level " + Math.ceil(+viewModel.character().level() / 2 ) + ")";
                break; 
            } 
            case 13: { 
                display = "Focus Spells (Level " + Math.ceil(+viewModel.character().level() / 2 ) + ")";
                break; 
            } 
            case 14: { 
                display = "Rituals";
                break; 
            } 
            default: { 
                display = "Level " + num; 
                break; 
            } 
        }

        return display;
    });
}

export class CharacterSpell {
    name: KnockoutObservable<string>;
    prepared: KnockoutObservable<boolean>;
    innateCurrent: KnockoutObservable<string>;
    innateMax: KnockoutObservable<string>;

    constructor(name: string){
        this.name = ko.observable(name);
        this.prepared = ko.observable(false);
        this.innateCurrent = ko.observable("0");
        this.innateMax = ko.observable("0");
    }
}