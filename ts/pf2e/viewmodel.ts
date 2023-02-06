import { Character } from "./character";
import { Spell } from "./spell";
import * as ko from "knockout";
import { Feat } from "./feat";
import { Gear } from "./gear";
import { initSpellAutoComplete } from "../shared/autocomplete";
import { spellCatalogController } from "./spells";

export class ViewModel {
    character: KnockoutObservable<Character>;
    spellCatalog: KnockoutObservableArray<Spell>;
    spell: KnockoutObservable<Spell>;
    featCatalog: KnockoutObservableArray<Feat>;
    feat: KnockoutObservable<Feat>;
    gearCatalog: KnockoutObservableArray<Gear>;
    gear: KnockoutObservable<Gear>;

    constructor(character: Character, 
        spells: Array<Spell>, spell: Spell, 
        feats: Array<Feat>, feat: Feat,
        equipment: Array<Gear>, gear: Gear) 
    {
        this.character = ko.observable(character);
        this.spellCatalog = ko.observableArray(spells);
	    this.spell = ko.observable(spell);
        this.featCatalog = ko.observableArray(feats);
        this.feat = ko.observable(feat);
        this.gearCatalog = ko.observableArray(equipment);
        this.gear = ko.observable(gear);
    }
}

export var viewModel = new ViewModel(new Character, 
    [], new Spell(), 
    [], new Feat(),
    [], new Gear());

//to be executed on document ready
export function applyDataBinding(){
    //valueAccessor: { the spellBookLevel (1-14), spell name }
    ko.bindingHandlers.bindSpell = {
        init: function(element: Node, valueAccessor: any){
            let args = valueAccessor();
            let lvl: number = ko.unwrap(args.level);
            
            var spellOptions;
            //1-10: regular level 1-10 spells
            if (lvl < 11){
                spellOptions = spellCatalogController.fullCatalog
                    .filter(s => s.category == "spell" && s.level == lvl && s.traits.value.indexOf("cantrip") == -1);
            }
            //11: Innate spell, return everything
            else if (lvl == 11){
                spellOptions = spellCatalogController.fullCatalog;
            }
            //12: Cantrips, return anything labeled cantrip, spell or focus
            else if (lvl == 12) {
                spellOptions = spellCatalogController.fullCatalog
                    .filter(s => s.traits.value.indexOf("cantrip") != -1);
            }
            //13: Focus Spells, return focus spells, but not focus cantrips
            else if (lvl == 13) {
                spellOptions = spellCatalogController.fullCatalog
                    .filter(s => s.category == "focus" && s.traits.value.indexOf("cantrip") == -1);
            }
            //14: Rituals, return only rituals
            else if (lvl == 14) {
                spellOptions = spellCatalogController.fullCatalog
                    .filter(s => s.category == "ritual" && s.traits.value.indexOf("cantrip") == -1);
            }


            let options: string[] = spellOptions.map(spell => spell.name);

            let observableName: KnockoutObservable<string> = args.name;
            initSpellAutoComplete(element, options, observableName, (el) => spellCatalogController.applyToolTip(el));

            spellCatalogController.applyToolTip(element as HTMLInputElement);
            element.addEventListener('keyup', event =>{
                spellCatalogController.applyToolTip(event.target as HTMLInputElement);
            });
        },
    }

    //valueAccessor: proficiency string
    ko.bindingHandlers.skillbox = {
        init: function(element: HTMLElement, valueAccessor: any){
            let profString = valueAccessor();

            element.addEventListener("click", event => {
                if (element.classList.contains("skillbox-untrained")){
                    element.classList.remove("skillbox-untrained");
                    element.classList.add("skillbox-trained");
                    element.innerHTML = "T";
                    profString("T");
                }
                else if (element.classList.contains("skillbox-trained")){
                    element.classList.remove("skillbox-trained");
                    element.classList.add("skillbox-expert");
                    element.innerHTML = "E";
                    profString("E");
                }
                else if (element.classList.contains("skillbox-expert")){
                    element.classList.remove("skillbox-expert");
                    element.classList.add("skillbox-master");
                    element.innerHTML = "M";
                    profString("M");
                }
                else if (element.classList.contains("skillbox-master")){
                    element.classList.remove("skillbox-master");
                    element.classList.add("skillbox-legendary");
                    element.innerHTML = "L";
                    profString("L");
                }
                else if (element.classList.contains("skillbox-legendary")){
                    element.classList.remove("skillbox-legendary");
                    element.classList.add("skillbox-untrained");
                    element.innerHTML = "U";
                    profString("U");
                }
            }, true);
        },
        update(element: HTMLElement, valueAccessor: any){
            let profString = valueAccessor();
            let value = ko.unwrap(profString());

            switch(value){
                case "T":
                    element.innerHTML = "T";
                    element.className = "skillbox skillbox-trained";
                    break;
                case "E":
                    element.innerHTML = "E";
                    element.className = "skillbox skillbox-expert";
                    break;
                case "M":
                    element.innerHTML = "M";
                    element.className = "skillbox skillbox-master";
                    break;
                case "L":
                    element.innerHTML = "L";
                    element.className = "skillbox skillbox-legendary";
                    break;
                case "U":
                default:
                    element.innerHTML = "U";
                    element.className = "skillbox skillbox-untrained";
                    break;
            }
        }
    }

    ko.applyBindings(viewModel)
}
