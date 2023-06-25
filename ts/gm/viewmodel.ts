import * as ko from "knockout";
import { InitiativeCreature } from "./initiative-creature";
import { FancyBarTemplate, FancyBarViewModel } from "../shared/components/fancybar";
import { Tune, TuneCategory } from "./tune";
import { DiceRollerTemplate, DiceRollerViewModel } from "../shared/components/diceroller";

export class ViewModel {
    initiativePCs: KnockoutObservableArray<InitiativeCreature>;
    initiativeMobs: KnockoutObservableArray<InitiativeCreature>;

    tuneName: KnockoutObservable<string>;
    tuneURL: KnockoutObservable<string>;
    tuneCategory: KnockoutObservable<string>;
    tuneSrc: KnockoutObservable<string>;
    tunes: KnockoutObservableArray<TuneCategory>;

    constructor(pcs: Array<InitiativeCreature>, mobs: Array<InitiativeCreature>, tunes: Array<TuneCategory>){
        this.initiativePCs = ko.observableArray(pcs);
        this.initiativeMobs = ko.observableArray(mobs);

        this.tuneName = ko.observable("");
        this.tuneURL = ko.observable("");
        this.tuneCategory = ko.observable("");
        this.tuneSrc = ko.observable("https://www.youtube.com/embed/DKP16d_WdZM");
        this.tunes = ko.observableArray([new TuneCategory()]);
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

export var viewModel = new ViewModel([], [], []);

//to be executed on document ready
export function applyDataBinding(){
    ko.components.register("fancy-bar", {
        viewModel: FancyBarViewModel,
        template: FancyBarTemplate
    });
    ko.components.register("dice-roller", {
        viewModel: DiceRollerViewModel,
        template: DiceRollerTemplate
    });

    ko.applyBindings(viewModel)
}