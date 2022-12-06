import * as ko from "knockout";
import { CatalogObject, CatalogTraits } from "../shared/catalog";

export class Gear extends CatalogObject {
    acBonus: number;
    baseItem: string;
    category: string;
    checkPenalty: number;
    name: string;
    damage: DamageStats;
    description: string;
    dexCap: number;
    group: string;
    hardness: number;
    health: GearHealth;
    level: number;
    price: any;
    source: string;
    traits: CatalogTraits;
    usage: string;

    rarityFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return this.capitalize(this.traits.rarity);
    });
    rarityClass: ko.PureComputed<string> = ko.pureComputed(() => {
        return "catalog-tag rarity-" + this.traits.rarity; 
    });
    tags: ko.PureComputed<string[]> = ko.pureComputed(() => {
	    return this.traits.value
            .map(x => this.capitalize(x))
            .sort();
    });    

    typeAndLevel: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Item  " + this.level;
    });    
    
    sourceFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Source: " + this.source;
    });

    constructor(json?: any){
        super();

        if(json === undefined){
            this.acBonus = 0;
            this.baseItem = "";
            this.category = "";
            this.checkPenalty = 0;
            this.name = "";

            this.damage = new DamageStats;
            this.damage.damageType = "";
            this.damage.dice = 0;
            this.damage.die = "";
            this.damage.value = "";

            this.dexCap = 0;
            this.description = "";
            this.group = "";
            this.hardness = 0;

            this.health = new GearHealth;
            this.health.brokenThreshold = 0;
            this.health.maxHP = 0;
            this.health.currentHP = 0;

            this.level = 1;
            this.price = { "": 0 }
            this.source = "";

            this.traits = new CatalogTraits;
            this.traits.custom = "";
            this.traits.rarity = "";
            this.traits.value = [];
            
            this.usage = "";
        }
        else{
            this.acBonus = json["armor"];
            this.baseItem = json["baseItem"];
            this.category = json["category"];
            this.checkPenalty = json["check"];
            this.name = json["name"];

            this.damage = new DamageStats;
            if (json["damage"]){
                this.damage.damageType = json["damage"]["damageType"];
                this.damage.dice = json["damage"]["dice"];
                this.damage.die = json["damage"]["die"];
                this.damage.value = json["damage"]["value"];
            }

            this.description = json["description"];
            this.dexCap = json["dex"];
            this.group = json["group"];
            this.hardness = json["hardness"];

            this.health = new GearHealth;
            if (json["hp"]){
                this.health.brokenThreshold = json["hp"]["brokenThreshold"];
                this.health.maxHP = json["hp"]["max"];
                this.health.currentHP = json["hp"]["value"];
            }

            this.level = json["level"] ? +json["level"] : 0;
            this.price = json["price"];
            this.source = json["source"];
            
            this.traits = new CatalogTraits;
            this.traits.custom = json["traits"]["custom"];
            this.traits.rarity = json["traits"]["rarity"];
            this.traits.value = json["traits"]["value"];

            this.usage = json["usage"];
        }
    }
}

class DamageStats {
    damageType: string;
    dice: number;
    die: string;
    value: string;  //unused?
}

class GearHealth {
    brokenThreshold: number;
    maxHP: number;
    currentHP: number;
}