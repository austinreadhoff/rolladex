import * as ko from "knockout";
import { Gear } from "../gear";

// ---
// Usage:

// ko.components.register("gear-catalog", {
//     viewModel: GearCatalogViewModel,
//     template: GearCatalogTemplate
// });

// <div id="gearcatalog">
//     <gear-catalog params="catalog: gearCatalog, gear: gear"></gear-catalog>
// </div>
// ---

export class GearCatalogViewModel {
    catalog = ko.observableArray<Gear>();
    gear = ko.observable<Gear>();

    constructor(params: any){
        this.catalog = params.catalog;
        this.gear = params.gear;
    }
}

export const GearCatalogTemplate: string = `
<div class="catalog-container print-hidden">
    <select data-bind="options: catalog, optionsText: 'name', optionsValue: 'name'" 
    id="gear-listbox" 
    class="catalog-listbox"
    size="2">
        <!--gear listbox here-->
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
            <div class="filter-toggle" id="level-filter-toggle"><label for="level-filters">Level    </label><span class="filter-toggle-icon">‣</span></div>
            <ul id="level-filters" hidden>
                <!--options autopopulated from catalog data-->
            </ul>
        </div>
        <div class="form-group">
            <div class="filter-toggle" id="source-filter-toggle"><label for="source-filters">Source    </label><span class="filter-toggle-icon">‣</span></div>
            <ul id="source-filters" hidden>
                <!--options autopopulated from catalog data-->
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
    <div data-bind="with: gear" id="catalog-content" class="gear-container block rpgui-container framed-golden-2 container-fluid">
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
                    <span data-bind="text: priceFormatted"></span><span>,</span>&nbsp
                    <span data-bind="text: weightFormatted"></span>
                </div>
                <div>
                    <span data-bind="text: armorStats, visible: acBonus > 0 && hardness == 0"></span>
                </div>
                <div>
                    <span data-bind="text: weaponStats, visible: damage.dice > 0"></span>
                </div>
                <div>
                    <span data-bind="text: shieldStats, visible: hardness > 0"></span>
                </div>
                <div>
                    <span data-bind="text: groupFormatted, visible: group.length > 0"></span>
                </div>
                <div>
                    <span data-bind="text: categoryFormatted, visible: category.length > 0"></span>
                </div>
                <div>
                    <span data-bind="text: usageFormatted, visible: usage.length > 0"></span>
                </div>
                <div>
                    <span data-bind="text: baseFormatted, visible: baseItem.length > 0"></span>
                </div>
                <hr>
                <div data-bind="html: description"></div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <!-- todo: button go here -->
            </div>
        </div>
    </div>
</div>
`;