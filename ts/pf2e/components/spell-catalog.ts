import * as ko from "knockout";
import { Spell } from "../spell";

// ---
// Usage:

// ko.components.register("spell-catalog-pf2e", {
//     viewModel: SpellCatalogPF2eViewModel,
//     template: SpellCatalogPF2eTemplate
// });

// <div id="spellcatalog">
//     <spell-catalog-pf2e params="catalog: spellCatalog, spell: spell, addFunc: function() {...}, disableFunc: function() {...}"></spell-catalog-pf2e>
// </div>
// ---

export class SpellCatalogPF2eViewModel {
    catalog = ko.observableArray<Spell>();
    spell = ko.observable<Spell>();
    addFunc = ko.observable<Function>();
    disableFunc = ko.observable<Function>();

    constructor(params: any){
        this.catalog = params.catalog;
        this.spell = params.spell;
        this.addFunc = params.addFunc;
        this.disableFunc = params.disableFunc
    }
}

export const SpellCatalogPF2eTemplate: string = `
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
            <input id="filter-name" class=" ignore">
        </div>
        <div class="form-group">
            <label for="filter-tags">Tags (; delimted)</label>
            <input id="filter-tags" class=" ignore">
        </div>
        <div class="form-group">
            <div class="filter-toggle" id="category-filter-toggle"><label for="category-filters">Category    </label><span class="filter-toggle-icon">‣</span></div>
            <ul id="category-filters" hidden>
                <!--options autopopulated from spell catalog data-->
            </ul>
        </div>
        <div class="form-group">
            <div class="filter-toggle" id="cantrip-filter-toggle"><label for="cantrip-filters">Cantrip    </label><span class="filter-toggle-icon">‣</span></div>
            <ul id="cantrip-filters" hidden>
                <li>
                    <input type="radio" name="cantrip-filter" id="cantrip-unfiltered" class="rpgui-radio" value="0" checked>
                    <label for="cantrip-unfiltered">Unfiltered</label>
                </li>
                <li>
                    <input type="radio" name="cantrip-filter" id="cantrip-yes" class="rpgui-radio" value="1">
                    <label for="cantrip-yes">Yes</label>
                </li>
                <li>
                    <input type="radio" name="cantrip-filter" id="cantrip-no" class="rpgui-radio" value="2">
                    <label for="cantrip-no">No</label>
                </li>
            </ul>
        </div>
        <div class="form-group">
            <div class="filter-toggle" id="level-filter-toggle"><label for="level-filters">Level    </label><span class="filter-toggle-icon">‣</span></div>
            <ul id="level-filters" hidden>
                <!--options autopopulated from spell catalog data-->
            </ul>
        </div>
        <div class="form-group">
            <div class="filter-toggle" id="tradition-filter-toggle"><label for="traidtion-filters">Tradition    </label><span class="filter-toggle-icon">‣</span></div>
            <ul id="tradition-filters" hidden>
                <!--options autopopulated from spell catalog data-->
            </ul>
        </div>
        <div class="form-group">
            <div class="filter-toggle" id="school-filter-toggle"><label for="school-filters">School    </label><span class="filter-toggle-icon">‣</span></div>
            <ul id="school-filters" hidden>
                <!--options autopopulated from spell catalog data-->
            </ul>
        </div>
        <div class="form-group">
            <div class="filter-toggle" id="source-filter-toggle"><label for="source-filters">Source    </label><span class="filter-toggle-icon">‣</span></div>
            <ul id="source-filters" hidden>
                <!--options autopopulated from spell catalog data-->
            </ul>
        </div>
        <div class="form-group">
            <div class="filter-toggle" id="rarity-filter-toggle"><label for="rarity-filters">Rarity    </label><span class="filter-toggle-icon">‣</span></div>
            <ul id="rarity-filters" hidden>
                <li class="form-check">
                    <input class="rpgui-checkbox catalog-filter rarity-filter" type="checkbox" id="rarity-filter-common" data-filterval="common">
                    <label class="form-check-label" for="rarity-filter-common">common</label>
                </li>
                <li class="form-check">
                    <input class="rpgui-checkbox catalog-filter rarity-filter" type="checkbox" id="rarity-filter-uncommon" data-filterval="uncommon">
                    <label class="form-check-label" for="rarity-filter-uncommon">uncommon</label>
                </li>
                <li class="form-check">
                    <input class="rpgui-checkbox catalog-filter rarity-filter" type="checkbox" id="rarity-filter-rare" data-filterval="rare">
                    <label class="form-check-label" for="rarity-filter-rare">rare</label>
                </li>
                <li class="form-check">
                    <input class="rpgui-checkbox catalog-filter rarity-filter" type="checkbox" id="rarity-filter-unique" data-filterval="unique">
                    <label class="form-check-label" for="rarity-filter-unique">unique</label>
                </li>
            </ul>
        </div>
    </div>
    <div data-bind="with: spell" id="catalog-content" class="rpgui-container framed-golden-2 container-fluid">
        <div class="row" id="catalog-text-row">
            <div class="col" id="catalog-text-col">
                <h3 data-bind="text: typeAndLevel" id="type-level"></h3>
                <div>
                    <span data-bind="text: rarityFormatted, class: rarityClass"></span>
                    <!-- ko foreach: tags  -->
                    <span data-bind="text: $data" class="catalog-tag"></span>
                    <!-- /ko -->
                </div>
                <div>
                    <span data-bind="text: sourceFormatted, visible: source.length > 0"></span>
                </div>
                <div>
                    <span data-bind="text: traditionsFormatted, visible: traditions.length > 0"></span>
                </div>
                <div>
                    <span data-bind="text: timeAndComponents"></span>
                </div>
                <div>
                    <span data-bind="text: costFormatted, visible: cost.length > 0"></span>
                </div>
                <div>
                    <span data-bind="text: secondaryCastersFormatted, visible: secondaryCasters.length > 0"></span>
                </div>
                <div>
                    <span data-bind="text: primaryCheckFormatted, visible: primaryCheck.length > 0"></span>
                </div>
                <div>
                    <span data-bind="text: secondaryCheckFormatted, visible: secondaryCheck.length > 0"></span>
                </div>
                <div>
                    <span data-bind="text: areaFormatted, visible: area.type.length > 0"></span>
                </div>
                <div>
                    <span data-bind="text: saveFormatted, visible: savingThrow.value.length > 0"></span>
                </div>
                <div>
                    <span data-bind="text: rangeFormatted, visible: range.length > 0"></span>
                </div>
                <div>
                    <span data-bind="text: targetFormatted, visible: target.length > 0"></span>
                </div>
                <div>
                    <span data-bind="text: durationFormatted, visible: duration.length > 0"></span>
                </div>
                <hr>
                <div data-bind="html: description"></div>
            </div>
        </div>
        <div data-bind="if: $parent.addFunc" class="row">
            <div class="col">
                <button data-bind="click: function(){ $parent.addFunc(level, name) }, disable: $parent.disableFunc(name)" type="button" id="btn-learn-spell" class="rpgui-button golden"><p>+ Add to Spellbook</p></button>
            </div>
        </div>
    </div>
</div>
`;