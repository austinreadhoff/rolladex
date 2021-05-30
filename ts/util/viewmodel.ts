import { Spell } from "./spell";
import * as ko from "knockout";

export class ViewModel {
    spellCatalog: KnockoutObservableArray<Spell>;
    spell: KnockoutObservable<Spell>;

    constructor(spells: Array<Spell>, spell: Spell){
        this.spellCatalog = ko.observableArray(spells);
        this.spell = ko.observable(spell);
    }
}

export var viewModel = new ViewModel([], new Spell());

//to be executed on document ready
export function applyDataBinding(){
    ko.applyBindings(viewModel)
}