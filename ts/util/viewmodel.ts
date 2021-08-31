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
    //valueAccessor: the spell level
    ko.bindingHandlers.bindSpell = {
        init: function(element: Node, valueAccessor: any){
            let lvl: number = ko.unwrap(valueAccessor());
            initSpellAutoComplete(element, lvl);

            element.addEventListener('keyup', event =>{
                applySpellTip(event.target as HTMLInputElement);
            });
        },
    }

    ko.applyBindings(viewModel)
}