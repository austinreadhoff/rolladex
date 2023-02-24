import * as ko from "knockout";
import { DiceRoll } from "./dice-roll";
import { InitiativeCreature } from "./initiative-creature";
import { FancyBarTemplate, FancyBarViewModel } from "../shared/components/fancybar";
import { Tune } from "./tune";

export class ViewModel {
    previousRolls: KnockoutObservableArray<DiceRoll>;

    initiativePCs: KnockoutObservableArray<InitiativeCreature>;
    initiativeMobs: KnockoutObservableArray<InitiativeCreature>;

    tuneName: KnockoutObservable<string>;
    tuneURL: KnockoutObservable<string>;
    tuneSrc: KnockoutObservable<string>;
    tunes: KnockoutObservableArray<Tune>;

    constructor(previousRolls: Array<DiceRoll>, pcs: Array<InitiativeCreature>, mobs: Array<InitiativeCreature>, tunes: Array<Tune>){
        this.previousRolls = ko.observableArray(previousRolls);

        this.initiativePCs = ko.observableArray(pcs);
        this.initiativeMobs = ko.observableArray(mobs);

        this.tuneName = ko.observable("");
        this.tuneURL = ko.observable("");
        this.tuneSrc = ko.observable("https://www.youtube.com/embed/DKP16d_WdZM");
        this.tunes = ko.observableArray(tunes);
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

    initiativeOrder(){
        return ko.computed(() => {
            let filteredMobs: Array<InitiativeCreature> = [];
            this.initiativeMobs().forEach((mob) => {
                if (!filteredMobs.some(m => m.name() == mob.name()))
                    filteredMobs.push(mob);
            });

            return this.initiativePCs()
            .concat(filteredMobs)
            .sort((i1, i2) => {return +i1.initiative() < +i2.initiative() ? 1 : -1})
            .map((i) => i.name())
            .join(" -> ");
        }, this);
    }
    addPC(){
        this.initiativePCs.push(new InitiativeCreature());
    }
    removePC(row: InitiativeCreature){
        viewModel.initiativePCs.remove(row);
    }
    addMob(){
        this.initiativeMobs.push(new InitiativeCreature());
    }
    removeMob(row: InitiativeCreature){
        viewModel.initiativeMobs.remove(row);
    }

    addTune(){
        if (this.tuneName().trim() !== "" && this.tuneURL().trim() !== ""){
            this.tunes.push(new Tune(this.tuneName(),this.tuneURL()));
            this.tuneName("");
            this.tuneURL("");
        }
    }
    removeTune(row: Tune){
        viewModel.tunes.remove(row);
    }
    playTune(tune: Tune){
        viewModel.tuneSrc("https://www.youtube.com/embed/" + tune.url());
    }
}

export var viewModel = new ViewModel([], [], [], []);

//to be executed on document ready
export function applyDataBinding(){
    ko.components.register("fancy-bar", {
        viewModel: FancyBarViewModel,
        template: FancyBarTemplate
    });

    ko.applyBindings(viewModel)
}