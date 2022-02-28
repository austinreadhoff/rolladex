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

        let savedProperties: string[] = ['characterName', 'playerName', 'xp', 'ancestryHeritage', 'background', 'characterClass',
         'size', 'alignment', 'traits', 'diety', 'level', 'heroPoints'];
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
}