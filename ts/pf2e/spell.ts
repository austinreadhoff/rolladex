import * as ko from "knockout";
import { CatalogObject, CatalogTraits } from "../shared/catalog";

export class Spell extends CatalogObject {
    name: string;
    category: string;
    components: SpellComponentProperties;
    cost: string;
    description: string;
    duration: string;
    level: number;
    materials: string;
    range: string;
    school: string;
    source: string;
    target: string;
    time: number;
    traditions: string[];
    traits: CatalogTraits;
    primaryCheck: string;
    secondaryCheck: string;
    savingThrow: SpellSave;
    secondaryCasters: string;

    rarityFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return this.capitalize(this.traits.rarity);
    });
    rarityClass: ko.PureComputed<string> = ko.pureComputed(() => {
        return "catalog-tag rarity-" + this.traits.rarity; 
    });

    tags: ko.PureComputed<string[]> = ko.pureComputed(() => {
	    return this.traits.value
            .map(x => this.capitalize(x))
            .concat(this.capitalize(this.school))
            .sort();
    });

    typeAndLevel: ko.PureComputed<string> = ko.pureComputed(() => {
        let s = "";
        
        if (this.traits.value.indexOf("cantrip") != -1)
            s = "Cantrip ";
        else if (this.category == "spell")
            s = "Spell ";
        else if (this.category == "ritual")
            s = "Ritual ";
        else if (this.category == "focus")
            s = "Focus ";

        s += this.level;
        return s;
    });
    
    costFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Cost: " + this.cost;
    });

    secondaryCastersFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Secondary Casters: " + this.secondaryCasters;
    });

    primaryCheckFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Primary Check: " + this.primaryCheck;
    });

    secondaryCheckFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Secondary Check(s): " + this.secondaryCheck;
    });

    saveFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Saving Thow: " 
            + (this.savingThrow.basic.length > 0 ? this.capitalize(this.savingThrow.basic + " ") : "") 
            + this.capitalize(this.savingThrow.value);
    });

    durationFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Duration: " + this.duration;
    });

    rangeFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Range: " + this.range;
    });
    
    sourceFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Source: " + this.source;
    });

    targetFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Target(s): " + this.target;
    });

    timeAndComponents: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Cast: " + this.time + ", " + this.components.toString();
    });
    
    traditionsFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Traditions: " + this.traditions
            .map(x => this.capitalize(x))
            .join(", ");
    });

    constructor(json?: any){
        super();

        if(json === undefined){
            this.name = "";
            this.category = "";
                
            this.components = new SpellComponentProperties;
            this.components.focus = false;
            this.components.material = false;
            this.components.somatic = false;
            this.components.verbal = false;
            
            this.cost = "";
            this.description = "";
            this.duration = "";
            this.level = 1;
            this.materials = "";
            this.range = "";
            this.school = "";
            this.source = "";
            this.target = "";
            this.time = 1;
            this.traditions = [];

            this.traits = new CatalogTraits;
            this.traits.custom = "";
            this.traits.rarity = "";
            this.traits.value = [];
            
            this.primaryCheck = "";
            this.secondaryCheck = "";
            this.secondaryCasters = "";
            this.savingThrow = new SpellSave;
            this.savingThrow.basic = "";
            this.savingThrow.value = "";
        }
        else{
            this.name = json["name"];
            this.category = json["category"];
            
            this.components = new SpellComponentProperties;
	        this.components.focus = json["components"]["focus"];
            this.components.material = json["components"]["material"];
            this.components.somatic = json["components"]["somatic"];
            this.components.verbal = json["components"]["verbal"];

            this.cost = json["cost"];
            this.description = json["description"];
            this.duration = json["duration"];
            this.level = +json["level"];
	        this.materials = json["materials"];
            this.range = json["range"];
            this.school = json["school"];
            this.source = json["source"];
            this.target = json["target"];
            this.time = json["time"];
            this.traditions = json["traditions"];
            
            this.traits = new CatalogTraits;
            this.traits.custom = json["traits"]["custom"];
            this.traits.rarity = json["traits"]["rarity"];
            this.traits.value = json["traits"]["value"];

            this.primaryCheck = json["primarycheck"] == undefined ? "" : json["primarycheck"];
            this.secondaryCheck = json["secondarycheck"] == undefined ? "" : json["secondarycheck"];
            this.secondaryCasters = json["secondarycasters"] == undefined ? "" : json["secondarycasters"];

            this.savingThrow = new SpellSave;
            this.savingThrow.basic = json["save"]["basic"];
            this.savingThrow.value = json["save"]["value"];
        }
    }
}

export class SpellComponentProperties {
    focus: boolean;
    material: boolean;
    somatic: boolean;
    verbal: boolean;

    toString(): string{
	let output = "";
	if (this.material)
    output += "Material";
	if (this.somatic)
	    output += (output == "" ? "" : ", ") + "Somatic"
	if (this.verbal)
	    output += (output == "" ? "" : ", ") + "Verbal"
	if (this.focus)
	    output += (output == "" ? "" : ", ") + "Focus"

	return output;
    }
}

export class SpellSave {
    basic: string;
    value: string;
}