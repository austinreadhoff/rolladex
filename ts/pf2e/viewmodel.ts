import { Character } from "./character";
import { Spell } from "./spell";
import * as ko from "knockout";
import { initSpellAutoComplete } from "../shared/autocomplete";
import { spellCatalogController } from "./spells";
import { FancyBarTemplate, FancyBarViewModel } from "../shared/components/fancybar";
import { DiceRollerTemplate, DiceRollerViewModel } from "../shared/components/diceroller";
import { ModalTemplate, ModalViewModel, registerModalHandlers } from "../shared/components/modal";
import { SpellCatalogPF2eTemplate, SpellCatalogPF2eViewModel } from "./components/spell-catalog";

export interface SpellViewModel2e{
    spellCatalog2e: KnockoutObservableArray<Spell>;
    spell2e: KnockoutObservable<Spell>;
}

export class ViewModel implements SpellViewModel2e {
    character: KnockoutObservable<Character>;
    spellCatalog2e: KnockoutObservableArray<Spell>;
    spell2e: KnockoutObservable<Spell>;

    constructor(character: Character, 
        spells: Array<Spell>, spell: Spell) 
    {
        this.character = ko.observable(character);
        this.spellCatalog2e = ko.observableArray(spells);
	    this.spell2e = ko.observable(spell);
    }
}

export var viewModel = new ViewModel(new Character, [], new Spell());

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
    ko.components.register("spell-catalog-pf2e", {
        viewModel: SpellCatalogPF2eViewModel,
        template: SpellCatalogPF2eTemplate
    });
    registerModalHandlers();

    //valueAccessor: { the spellBookLevel (1-14), spell name }
    ko.bindingHandlers.bindSpell = {
        init: function(element: Node, valueAccessor: any){
            let args = valueAccessor();
            let lvl: number = ko.unwrap(args.level);
            
            var spellOptions;
            //1-10: regular level 1-10 spells
            if (lvl < 11){
                spellOptions = spellCatalogController.fullCatalog
                    .filter(s => s.category == "spell" && s.level == lvl && s.traits.value.indexOf("cantrip") == -1);
            }
            //11: Innate spell, return everything
            else if (lvl == 11){
                spellOptions = spellCatalogController.fullCatalog;
            }
            //12: Cantrips, return anything labeled cantrip, spell or focus
            else if (lvl == 12) {
                spellOptions = spellCatalogController.fullCatalog
                    .filter(s => s.traits.value.indexOf("cantrip") != -1);
            }
            //13: Focus Spells, return focus spells, but not focus cantrips
            else if (lvl == 13) {
                spellOptions = spellCatalogController.fullCatalog
                    .filter(s => s.category == "focus" && s.traits.value.indexOf("cantrip") == -1);
            }
            //14: Rituals, return only rituals
            else if (lvl == 14) {
                spellOptions = spellCatalogController.fullCatalog
                    .filter(s => s.category == "ritual" && s.traits.value.indexOf("cantrip") == -1);
            }


            let options: string[] = spellOptions.map(spell => spell.name);

            let observableName: KnockoutObservable<string> = args.name;
            initSpellAutoComplete(element, options, observableName, (el) => spellCatalogController.applyToolTip(el));

            spellCatalogController.applyToolTip(element as HTMLInputElement);
            element.addEventListener('keyup', event =>{
                spellCatalogController.applyToolTip(event.target as HTMLInputElement);
            });
        },
    }

    //valueAccessor: proficiency string
    ko.bindingHandlers.skillbox = {
        init: function(element: HTMLElement, valueAccessor: any){
            let profString = valueAccessor();

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
