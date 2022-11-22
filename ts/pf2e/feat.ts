import * as ko from "knockout";
import { CatalogObject, CatalogTraits } from "../shared/catalog";

export class Feat extends CatalogObject {
    name: string;
    actionType: string;
    description: string;
    featType: string;
    level: number;
    prerequisites: string[];
    source: string;
    traits: CatalogTraits;

    rarityFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return this.capitalize(this.traits.rarity);
    });
    rarityClass: ko.PureComputed<string> = ko.pureComputed(() => {
        return "feat-tag rarity-" + this.traits.rarity; 
    });
    tags: ko.PureComputed<string[]> = ko.pureComputed(() => {
	    return this.traits.value
            .map(x => this.capitalize(x))
            .sort();
    });

    typeAndLevel: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Feat " + this.level;
    });    
    
    sourceFormatted: ko.PureComputed<string> = ko.pureComputed(() => {
        return "Source: " + this.source;
    });

    constructor(json?: any){
        super();

        if(json === undefined){
            this.name = "";
            this.actionType = "";
            this.description = "";
            this.featType = "";
            this.level = 1;
            this.prerequisites = [];
            this.source = "";

            this.traits = new CatalogTraits;
            this.traits.custom = "";
            this.traits.rarity = "";
            this.traits.value = [];
        }
        else{
            this.name = json["name"];
            this.actionType = json["actionType"];
            this.description = json["description"];
            this.featType = json["featType"];
            this.level = +json["level"];
            this.prerequisites = json["prerequisites"];
            this.source = json["source"];
            
            this.traits = new CatalogTraits;
            this.traits.custom = json["traits"]["custom"];
            this.traits.rarity = json["traits"]["rarity"];
            this.traits.value = json["traits"]["value"];
        }
    }
}