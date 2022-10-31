import * as ko from "knockout";

export class Spell {
    name: string;
    category: string;
    components: SpellComponentProperties;
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
    traits: SpellTraits;

    traditionsFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Traditions: " + this.traditions.join(", ");
    });

    constructor(json?: any){
        if(json === undefined){
            this.name = "";
	    this.category = "";
            
            this.components = new SpellComponentProperties;
	    this.components.focus = false;
            this.components.material = false;
            this.components.somatic = false;
            this.components.verbal = false;
            
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

	    this.traits = new SpellTraits;
	    this.traits.custom = "";
	    this.traits.rarity = "";
	    this.traits.value = [];
        }
        else{
            this.name = json["name"];
            this.category = json["category"];
            
            this.components = new SpellComponentProperties;
	    this.components.focus = json["components"]["focus"];
            this.components.material = json["components"]["material"];
            this.components.somatic = json["components"]["somatic"];
            this.components.verbal = json["components"]["verbal"];

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
	    
	    this.traits = new SpellTraits;
	    this.traits.custom = json["traits"]["custom"];
	    this.traits.rarity = json["traits"]["rarity"];
	    this.traits.value = json["traits"]["value"];
        }
    }
}

export class SpellComponentProperties {
    focus: boolean;
    material: boolean;
    somatic: boolean;
    verbal: boolean;
}

export class SpellTraits {
    custom: string; //Can this be removed?
    rarity: string;
    value: string[];
}
