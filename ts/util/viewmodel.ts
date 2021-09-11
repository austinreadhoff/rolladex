import { Character } from "./character"
import { Spell } from "./spell";
import * as ko from "knockout";
import { initSpellAutoComplete } from "../renderer/autocomplete";
import { applySpellTip } from "../renderer/spells-renderer";

export class ViewModel {
    character: KnockoutObservable<Character>;
    spellCatalog: KnockoutObservableArray<Spell>;
    spell: KnockoutObservable<Spell>;

    constructor(character: Character, spells: Array<Spell>, spell: Spell){
        this.character = ko.observable(character);
        this.spellCatalog = ko.observableArray(spells);
        this.spell = ko.observable(spell);
    }
}

export var viewModel = new ViewModel(new Character, [], new Spell());

//to be executed on document ready
export function applyDataBinding(){
    //valueAccessor: { the spell level, spell name }
    ko.bindingHandlers.bindSpell = {
        init: function(element: Node, valueAccessor: any){
            let args = valueAccessor();
            let lvl: number = ko.unwrap(args.level);
            let observableName: KnockoutObservable<string> = args.name;
            initSpellAutoComplete(element, lvl, observableName);

            applySpellTip(element as HTMLInputElement);
            element.addEventListener('keyup', event =>{
                applySpellTip(event.target as HTMLInputElement);
            });
        },
    }

    //valueAccessor: proficiency string
    ko.bindingHandlers.skillbox = {
        init: function(element: HTMLElement, valueAccessor: any){
            let profString = valueAccessor();
            let value = ko.unwrap(profString());

            

            element.addEventListener("click", event => {
                if (element.classList.contains("skillbox-null")){
                    element.classList.remove("skillbox-null");
                    element.classList.add("skillbox-proficient");
                    element.innerHTML = "P";
                    profString("P");
                }
                else if (element.classList.contains("skillbox-proficient")){
                    element.classList.remove("skillbox-proficient");
                    element.classList.add("skillbox-expertise");
                    element.innerHTML = "E";
                    profString("E");
                }
                else if (element.classList.contains("skillbox-expertise")){
                    element.classList.remove("skillbox-expertise");
                    element.classList.add("skillbox-null");
                    element.innerHTML = "&nbsp";
                    profString("&nbsp");
                }
            }, true);
        },
        update(element: HTMLElement, valueAccessor: any){
            let profString = valueAccessor();
            let value = ko.unwrap(profString());

            switch(value){
                case "P":
                    element.innerHTML = "P";
                    element.className = "skillbox skillbox-proficient";
                    break;
                case "E":
                    element.innerHTML = "E";
                    element.className = "skillbox skillbox-expertise";
                    break;
                case "&nbsp":
                default:
                    element.innerHTML = "&nbsp";
                    element.className = "skillbox skillbox-null";
                    break;
            }
        }
    }

    ko.applyBindings(viewModel)
}