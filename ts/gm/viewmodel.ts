import * as ko from "knockout";
import { DiceRoll } from "./dice-roll";
//import { FancyBarTemplate, FancyBarViewModel } from "../shared/components/fancybar";

export class ViewModel {
    previousRolls: KnockoutObservableArray<DiceRoll>;

    constructor(previousRolls: Array<DiceRoll>){
        this.previousRolls = ko.observableArray(previousRolls);
    }

    rollDice(d: string, e: KeyboardEvent) {
        if (e.key == 'Enter'){
            let input = e.currentTarget as HTMLInputElement;
            if (input.value.trim() === "")
                return true;

            this.previousRolls.unshift(new DiceRoll(input.value));
            input.value = "";
            if (this.previousRolls().length > 10)
                this.previousRolls.pop();
        }
        return true;
    }
}

export var viewModel = new ViewModel([]);

//to be executed on document ready
export function applyDataBinding(){
    // ko.components.register("fancy-bar", {
    //     viewModel: FancyBarViewModel,
    //     template: FancyBarTemplate
    // });

    ko.applyBindings(viewModel)
}