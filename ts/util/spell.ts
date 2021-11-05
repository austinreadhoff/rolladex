import * as ko from "knockout";

export class Spell {
    name: string;
    castingTime: string;
    classes: string[];
    components: SpellComponentProperties;
    description: string;
    duration: string;
    higherLevelDescription: string;
    level: number;
    range: string;
    ritual: boolean;
    school: string;
    source: string;

    classesFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        var classes = this.classes.join(", ")
        return "Classes: " + classes;
    });

    sourceFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Source: " + this.source;
    });
    
    fullTextFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        var spellType = this.school;
        if (this.level == 0){
            spellType += " Cantrip"
        }
        else{
            var levelFragment;

            if (this.level == 1)
                levelFragment = "1st"
            else if (this.level == 2)
                levelFragment = "2nd"
            else if (this.level == 3)
                levelFragment = "3rd"
            else
                levelFragment = this.level.toString() + "th"

            spellType = levelFragment + "-level " + spellType
        }
        if (this.ritual){
            spellType += " (ritual)"
        }

        var rawComponentString = "";
        if (this.components.verbal){
            rawComponentString += "V"
        }
        if (this.components.somatic){
            rawComponentString += rawComponentString.length > 0 ? ", S" : "S";
        } 
        if (this.components.material){
            rawComponentString += rawComponentString.length > 0 ? ", M" : "M";
            rawComponentString += " (" + this.components.materials + ")"
        }

        var fullDescription = this.higherLevelDescription ? (this.description + "\n\nAt Higher Levels: " + this.higherLevelDescription) : this.description

        var text = 
        `${spellType}\n`
        +`Casting Time: ${this.castingTime}\n`
        +`Range: ${this.range}\n`
        +`Components: ${rawComponentString}\n`
        +`Duration: ${this.duration}\n\n`

        +`${fullDescription}`;

        return text;
    });

    constructor(json?: any){
        if(json === undefined){
            this.name = "";
            this.castingTime = "";
            this.classes = [];
            
            this.components = new SpellComponentProperties;
            this.components.material = false;
            this.components.somatic = false;
            this.components.verbal = false;
            this.components.materials = "";
            
            this.description = "";
            this.duration = "";
            this.higherLevelDescription = "";
            this.level = 0;
            this.range = "";
            this.ritual = false;
            this.school = "";
            this.source = "";
        }
        else{
            this.name = json["name"];
            this.castingTime = json["casting_time"];
            this.classes = json["classes"];
            
            this.components = new SpellComponentProperties;
            this.components.material = json["components"]["material"];
            this.components.somatic = json["components"]["somatic"];
            this.components.verbal = json["components"]["verbal"];
            this.components.materials = json["components"]["materials"] ? json["components"]["materials"] : "";

            this.description = json["description"];
            this.duration = json["duration"];
            this.higherLevelDescription = json["higher_levels"];
            this.level = +json["level"];
            this.range = json["range"];
            this.ritual = json["ritual"] == "true" ? true : false;
            this.school = json["school"];
            this.source = json["source"];
        }
    }
}

export class SpellComponentProperties {
    material: boolean;
    somatic: boolean;
    verbal: boolean;
    materials: string;
}