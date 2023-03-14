import * as ko from "knockout";
import { DiceRoll } from "./dice-roll";
import { InitiativeCreature } from "./initiative-creature";
import { FancyBarTemplate, FancyBarViewModel } from "../shared/components/fancybar";
import { Tune, TuneCategory } from "./tune";

export class ViewModel {
    previousRolls: KnockoutObservableArray<DiceRoll>;
    historyIndex: number;

    initiativePCs: KnockoutObservableArray<InitiativeCreature>;
    initiativeMobs: KnockoutObservableArray<InitiativeCreature>;

    tuneName: KnockoutObservable<string>;
    tuneURL: KnockoutObservable<string>;
    tuneCategory: KnockoutObservable<string>;
    tuneSrc: KnockoutObservable<string>;
    tunes: KnockoutObservableArray<TuneCategory>;

    constructor(previousRolls: Array<DiceRoll>, pcs: Array<InitiativeCreature>, mobs: Array<InitiativeCreature>, tunes: Array<TuneCategory>){
        this.previousRolls = ko.observableArray(previousRolls);
        this.historyIndex = -1;

        this.initiativePCs = ko.observableArray(pcs);
        this.initiativeMobs = ko.observableArray(mobs);

        this.tuneName = ko.observable("");
        this.tuneURL = ko.observable("");
        this.tuneCategory = ko.observable("");
        this.tuneSrc = ko.observable("https://www.youtube.com/embed/DKP16d_WdZM");
        this.tunes = ko.observableArray([new TuneCategory()]);
    }

    rollDice(d: string, e: KeyboardEvent) {
        if (e.key == 'Enter'){
            let input = e.currentTarget as HTMLInputElement;
            if (input.value.trim() === "")
                return true;

            this.previousRolls.unshift(new DiceRoll(input.value));
            input.value = "";
            this.historyIndex = -1;
            if (this.previousRolls().length > 10)
                this.previousRolls.pop();
        }
        else if (e.key == 'ArrowUp' && this.historyIndex < this.previousRolls().length-1){
            this.historyIndex++;
            (e.currentTarget as HTMLInputElement).value = this.previousRolls()[this.historyIndex].raw();
        }
        else if (e.key == 'ArrowDown' && this.historyIndex > -1){
            let input = e.currentTarget as HTMLInputElement;

            this.historyIndex--;
            if (this.historyIndex == -1)
                input.value = "";
            else
                input.value = this.previousRolls()[this.historyIndex].raw();
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

    addTuneCategory(){
        this.tunes.push(new TuneCategory());
    }
    removeTuneCategory(row: TuneCategory){
        viewModel.tunes.remove(row);
    }

    addTune(categoryName: string){
        let category = this.tunes().find(c => c.name() === categoryName);

        if (this.tuneName().trim() !== "" && this.tuneURL().trim() !== ""){
            category.tunes.push(new Tune(this.tuneName(),this.tuneURL()));
            this.tuneName("");
            this.tuneURL("");
        }
    }
    sortTune(tune: Tune, category: any, shiftValue: number){
        let arr = viewModel.tunes()[category()].tunes;
        let from = arr.indexOf(tune);
        let to = from + shiftValue;

        if (to >= 0 && to < arr().length){
            arr.splice(from, 1);
            arr.splice(to, 0, tune)
        }
    }
    removeTune(row: Tune, category: any){
        viewModel.tunes()[category()].tunes.remove(row);
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