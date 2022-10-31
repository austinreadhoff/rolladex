import { Character } from "./character";
import { Spell } from "./spell";
import * as ko from "knockout";

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
    //valueAccessor: proficiency string
    ko.bindingHandlers.skillbox = {
        init: function(element: HTMLElement, valueAccessor: any){
            let profString = valueAccessor();
            let value = ko.unwrap(profString());

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
