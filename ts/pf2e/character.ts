import * as ko from "knockout";
import { triggerUnsafeSave } from "../shared/save-tracker";
import { viewModel } from "./viewmodel";
import { jsonSchemaVersion, gameName } from "./character-schema";

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
    alignment: KnockoutObservable<string>;
    traits: KnockoutObservable<string>;
    diety: KnockoutObservable<string>;
    level: KnockoutObservable<string>;
    heroPoints: KnockoutObservable<string>;
    str: KnockoutObservable<string>;
    dex: KnockoutObservable<string>;
    con: KnockoutObservable<string>;
    int: KnockoutObservable<string>;
    wis: KnockoutObservable<string>;
    char: KnockoutObservable<string>;
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

    constructor(){
        this.version = ko.observable(jsonSchemaVersion);
        this.game = ko.observable(gameName);
        this.characterName = ko.observable("");
        this.playerName = ko.observable("");
        this.xp = ko.observable("");
        this.ancestryHeritage = ko.observable("");
        this.background = ko.observable("");
        this.characterClass = ko.observable("");
        this.size = ko.observable("");
        this.alignment = ko.observable("");
        this.traits = ko.observable("");
        this.diety = ko.observable("");
        this.level = ko.observable("");
        this.heroPoints = ko.observable("");
        this.str = ko.observable("");
        this.dex = ko.observable("");
        this.con = ko.observable("");
        this.int = ko.observable("");
        this.wis = ko.observable("");
        this.char = ko.observable("");
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


        let savedProperties: string[] = ['characterName', 'playerName', 'xp', 'ancestryHeritage', 'background', 'characterClass',
         'size', 'alignment', 'traits', 'diety', 'level', 'heroPoints', 'str', 'dex', 'con', 'int', 'wis', 'char',
         'perception', 'acrobatics', 'arcana', 'athletics', 'crafting', 'deception', 'diplomacy', 'intimidation', 'medicine',
         'nature', 'occultism', 'performance', 'religion', 'society', 'stealth', 'survival', 'thievery', 'savingReflex', 'savingFort', 'savingWill'];
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

    abilityMod(ability: number, proficiencyLevel = "U"){
        return ko.computed(() =>{
            let mod = this.calculateModifier(ability, proficiencyLevel);
            return mod < 0 ? mod.toString() : ("+" + mod);
        }, this);
    }


    abilityDC(abilityStr: string, proficiencyLevel = "U"){
        return ko.computed(() =>{
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

            let mod = this.calculateModifier(ability, proficiencyLevel);
            return 10 + mod;
        }, this);
    }

    private calculateModifier(ability: number, proficiencyLevel = "U"): number {
        if (!ability) return 0;

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

            let mod = Math.floor(ability / 2) - 5 + (proficiencyBonus)
            if (!mod) return 0;
            return mod;
    }
}