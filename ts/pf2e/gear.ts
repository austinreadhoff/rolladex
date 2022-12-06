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
    price: any; //contains a single key value pair where the key is the currency and the value is the amount
    source: string;
    speedPenalty: number;
    strengthRequirement: number;
    traits: CatalogTraits;
    usage: string;
    weight: string;

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
    
    armorStats: ko.PureComputed<string> = ko.pureComputed(() => {
        return "AC Bonus: +" + this.acBonus
        + "; Dex Cap: +" + this.dexCap
        + "; Check Penalty: " + this.checkPenalty
        + "; Speed Penalty: " + this.speedPenalty + "ft"
        + "; Strength: " + this.strengthRequirement;
    });
    weaponStats: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Damage: " + this.damage.dice + this.damage.die + " " + this.damage.damageType;
    });
    shieldStats: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Hardness: " + this.hardness
        + `; AC Bonus: ${this.acBonus}; Speed Penalty: ${this.speedPenalty}; HP (BT): ${this.health.maxHP} (${this.health.brokenThreshold})`;
    });

    baseFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Base Item: " + this.baseItem;
    });
    categoryFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Category: " + this.category;
    });
    groupFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Group: " + this.group;
    });
    priceFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        let str = "Price: "
        for(let key in this.price) {
            str += (this.price[key] + " " + key);
        }
        return str;
    });
    sourceFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Source: " + this.source;
    });
    usageFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Usage: " + this.usage;
    });
    weightFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Bulk: " + this.weight;
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
            this.price = {}
            this.source = "";
            this.speedPenalty = 0;
            this.strengthRequirement = 0;

            this.traits = new CatalogTraits;
            this.traits.custom = "";
            this.traits.rarity = "";
            this.traits.value = [];
            
            this.usage = "";
            this.weight = "";
        }
        else{
            this.acBonus = json["armor"];
            this.baseItem = json["baseItem"] ? json["baseItem"] : "";
            this.category = json["category"] ? json["category"] : "";
            this.checkPenalty = json["check"];
            this.name = json["name"];

            this.damage = new DamageStats;
            if (json["damage"]){
                this.damage.damageType = json["damage"]["damageType"];
                this.damage.dice = json["damage"]["dice"];
                this.damage.die = json["damage"]["die"];
                this.damage.value = json["damage"]["value"];
            }
            else{
                this.damage.damageType = "";
                this.damage.dice = 0;
                this.damage.die = "";
                this.damage.value = "";
            }

            this.description = json["description"];
            this.dexCap = json["dex"];
            this.group = json["group"] ? json["group"] : "";
            this.hardness = json["hardness"] ? json["hardness"] : 0;

            this.health = new GearHealth;
            if (json["hp"]){
                this.health.brokenThreshold = json["hp"]["brokenThreshold"];
                this.health.maxHP = json["hp"]["max"];
                this.health.currentHP = json["hp"]["value"];
            }
            else{
                this.health.brokenThreshold = 0;
                this.health.maxHP = 0;
                this.health.currentHP = 0;
            }

            this.level = json["level"] ? +json["level"] : 0;
            this.price = json["price"];
            this.source = json["source"];
            this.speedPenalty = json["speed"];
            this.strengthRequirement = json["strength"];
            
            this.traits = new CatalogTraits;
            this.traits.custom = json["traits"]["custom"];
            this.traits.rarity = json["traits"]["rarity"];
            this.traits.value = json["traits"]["value"];

            this.usage = json["usage"];
            this.weight = json["weight"];
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