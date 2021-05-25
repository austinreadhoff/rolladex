import { Spell } from "./spell";
import * as ko from "knockout";

export class ViewModel {
    spell: KnockoutObservable<Spell>;

    constructor(spell: Spell){
        this.spell = ko.observable(spell);
    }
}

export var viewModel = new ViewModel(new Spell());

//to be executed on document ready
export function applyDataBinding(){
    ko.applyBindings(viewModel)
}