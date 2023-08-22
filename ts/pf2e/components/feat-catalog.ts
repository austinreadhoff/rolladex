import * as ko from "knockout";
import { Feat } from "../feat";

// ---
// Usage:

// ko.components.register("feat-catalog", {
//     viewModel: FeatCatalogViewModel,
//     template: FeatCatalogTemplate
// });

// <div id="featcatalog">
//     <feat-catalog params="catalog: featCatalog, feat: feat"></feat-catalog>
// </div>
// ---

export class FeatCatalogViewModel {
    catalog = ko.observableArray<Feat>();
    feat = ko.observable<Feat>();

    constructor(params: any){
        this.catalog = params.catalog;
        this.feat = params.feat;
    }
}

export const FeatCatalogTemplate: string = `
<div class="catalog-container print-hidden">
    <select data-bind="options: catalog, optionsText: 'name', optionsValue: 'name'" 
    id="feat-listbox" 
    class="catalog-listbox"
    size="2">
        <!--feat listbox here-->
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
            <div class="filter-toggle" id="type-filter-toggle"><label for="type-filters">Type    </label><span class="filter-toggle-icon">‣</span></div>
            <ul id="type-filters" hidden>
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
    <div data-bind="with: feat" id="catalog-content" class="feat-container block rpgui-container framed-golden-2 container-fluid">
        <div class="row" id="catalog-text-row">
            <div class="col" id="catalog-text-col">
                <h3 data-bind="text: typeAndLevel" id="type-level"></h3>
                <div>
                    <span data-bind="text: rarityFormatted, class: rarityClass"></span>
                    <!-- ko foreach: tags  -->
                    <span data-bind="text: $data" class="catalog-tag"></span>
                    <!-- /ko -->
                    <span data-bind="text: actionDisplay"></span>
                </div>
                <div>
                    <span data-bind="text: sourceFormatted, visible: source.length > 0"></span>
                </div>
                <div>
                    <span data-bind="text: prerequisitesFormatted, visible: prerequisites.length > 0"></span>
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