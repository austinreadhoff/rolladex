import * as ko from "knockout";
import { Spell } from "../spell";

// ---
// Usage:

// ko.components.register("spell-catalog-dnd5e", {
//     viewModel: SpellCatalogDND5eViewModel,
//     template: SpellCatalogDND5eTemplate
// });

// <div id="spellcatalog">
//     <spell-catalog-dnd5e params="catalog: spellCatalog, spell: spell, addFunc: function() {...}, disableFunc: function() {...}"></spell-catalog-dnd5e>
// </div>
// ---

export class SpellCatalogDND5eViewModel {
    catalog = ko.observableArray<Spell>();
    spell = ko.observable<Spell>();
    showAddBttn = ko.observable<boolean>();
    addFunc = ko.observable<Function>();
    disableFunc = ko.observable<Function>();

    constructor(params: any){
        this.catalog = params.catalog;
        this.spell = params.spell;
        this.addFunc = params.addFunc;
        this.disableFunc = params.disableFunc
    }
}

export const SpellCatalogDND5eTemplate: string = `
<div class="catalog-container print-hidden">
    <select data-bind="options: catalog, optionsText: 'name', optionsValue: 'name'" 
        id="spell-listbox"
        class="catalog-listbox" 
        size="2">
        <!--spell listbox here-->
    </select>
    <div class="rpgui-container framed catalog-filters">
        <div class="form-group">
            <button type="button" id="btn-clear-filters" class="rpgui-button"><p>Unfilter</p></button>
        </div>
        <div class="form-group">
            <label for="filter-name">Name</label>
            <input id="filter-name">
        </div>
        <div class="form-group">
            <div class="filter-toggle" id="level-filter-toggle"><label for="level-filters">Level    </label><span class="filter-toggle-icon">‣</span></div>
            <ul id="level-filters" hidden>
                <!--options autopopulated from spell catalog data-->
            </ul>
        </div>
        <div class="form-group">
            <div class="filter-toggle" id="class-filter-toggle"><label for="class-filters">Class    </label><span class="filter-toggle-icon">‣</span></div>
            <ul id="class-filters" hidden>
                <!--options autopopulated from spell catalog data-->
            </ul>
        </div>
        <div class="form-group">
            <div class="filter-toggle" id="school-filter-toggle"><label for="school-filters">School  </label><span class="filter-toggle-icon">‣</span></div>
            <ul id="school-filters" hidden>
                <!--options autopopulated from spell catalog data-->
            </ul>
        </div>
        <div class="form-group">
            <div class="filter-toggle" id="source-filter-toggle"><label for="source-filters">Source  </label><span class="filter-toggle-icon">‣</span></div>
            <ul id="source-filters" hidden>
                <!--options autopopulated from spell catalog data-->
            </ul>
        </div>
    </div>
    <div data-bind="with: spell" id="catalog-content" class="rpgui-container framed-golden-2 container-fluid">
        <div class="row">
            <div class="col">
                <i data-bind="text: sourceFormatted" id="catalog-source"></i>
            </div>
            <div class="col" id="catalog-classes-col">
                <i data-bind="text: classesFormatted" id="catalog-classes"></i>
            </div>
        </div>
        <div class="row" id="catalog-text-row">
            <div class="col" id="catalog-text-col">
                <p data-bind="text: fullTextFormatted" id="catalog-text"></p>
            </div>
        </div>
        <div data-bind="if: $parent.addFunc" class="row">
            <div class="col">
                <button data-bind="click: function() { $parent.addFunc(level, name) }, disable: $parent.disableFunc(name)" type="button" id="btn-learn-spell" class="rpgui-button golden"><p>+ Add to Spellbook</p></button>
            </div>
        </div>
    </div>
</div>
`;