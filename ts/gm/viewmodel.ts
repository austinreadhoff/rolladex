import * as ko from "knockout";
import { InitiativeCreature } from "./initiative-creature";
import { FancyBarTemplate, FancyBarViewModel } from "../shared/components/fancybar";
import { Tune, TuneCategory } from "./tune";
import { DiceRollerTemplate, DiceRollerViewModel } from "../shared/components/diceroller";
import { ModalTemplate, ModalViewModel, registerModalHandlers } from "../shared/components/modal";
import { SpellCatalogDND5eTemplate, SpellCatalogDND5eViewModel } from "../dnd5e/components/spell-catalog";
import { SpellViewModel5e } from "../dnd5e/viewmodel";
import { Spell as Spell5e } from "../dnd5e/spell";
import { SpellCatalogPF2eTemplate, SpellCatalogPF2eViewModel } from "../pf2e/components/spell-catalog";
import { SpellViewModel2e } from "../pf2e/viewmodel";
import { Spell as Spell2e } from "../pf2e/spell";

export class ViewModel 
implements SpellViewModel5e, SpellViewModel2e {
    name: KnockoutObservable<string>;
    gameType: KnockoutObservable<string>;

    initiativePCs: KnockoutObservableArray<InitiativeCreature>;
    initiativeMobs: KnockoutObservableArray<InitiativeCreature>;

    tuneName: KnockoutObservable<string>;
    tuneURL: KnockoutObservable<string>;
    tuneCategory: KnockoutObservable<string>;
    tuneSrc: KnockoutObservable<string>;
    tunes: KnockoutObservableArray<TuneCategory>;

    spellCatalog5e: KnockoutObservableArray<Spell5e>;
    spell5e: KnockoutObservable<Spell5e>;

    spellCatalog2e: KnockoutObservableArray<Spell2e>;
    spell2e: KnockoutObservable<Spell2e>;

    constructor(pcs: Array<InitiativeCreature>, mobs: Array<InitiativeCreature>, tunes: Array<TuneCategory>){
        this.name = ko.observable("");
        this.gameType = ko.observable("");

        this.initiativePCs = ko.observableArray(pcs);
        this.initiativeMobs = ko.observableArray(mobs);

        this.tuneName = ko.observable("");
        this.tuneURL = ko.observable("");
        this.tuneCategory = ko.observable("");
        this.tuneSrc = ko.observable("https://www.youtube.com/embed/DKP16d_WdZM");
        this.tunes = ko.observableArray([new TuneCategory()]);

        this.spellCatalog5e = ko.observableArray([]);
        this.spell5e = ko.observable(new Spell5e());

        this.spellCatalog2e = ko.observableArray([]);
        this.spell2e = ko.observable(new Spell2e());

        this.name.subscribe(function(){document.title = viewModel.name() + " - Rolladex"});
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
    ko.components.register("modal", {
        viewModel: ModalViewModel,
        template: ModalTemplate
    });
    ko.components.register("spell-catalog-dnd5e", {
        viewModel: SpellCatalogDND5eViewModel,
        template: SpellCatalogDND5eTemplate
    });
    ko.components.register("spell-catalog-pf2e", {
        viewModel: SpellCatalogPF2eViewModel,
        template: SpellCatalogPF2eTemplate
    });
    registerModalHandlers();

    ko.applyBindings(viewModel)
}