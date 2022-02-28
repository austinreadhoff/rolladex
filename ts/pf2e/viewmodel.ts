import { Character } from "./character"
import * as ko from "knockout";

export class ViewModel {
    character: KnockoutObservable<Character>;

    constructor(character: Character){
        this.character = ko.observable(character);
    }
}

export var viewModel = new ViewModel(new Character);

//to be executed on document ready
export function applyDataBinding(){
    ko.applyBindings(viewModel)
}