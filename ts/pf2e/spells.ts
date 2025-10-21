import { CatalogController, getJSON, populateFilterDropDown, setupFilterToggle } from "../shared/catalog";
import { Spell } from "./spell";
import { SpellViewModel2e } from "./viewmodel";

class SpellCatalogController implements CatalogController<Spell>{
    fullCatalog: Spell[] = [];
    baseElement: HTMLElement;

    loadData(viewModel: SpellViewModel2e) {
        return new Promise((resolve, reject) => {
            var spellFilePromises = [
                getJSON("../pf2e/collections/rituals.json"),
                getJSON("../pf2e/collections/focus.json"),
                getJSON("../pf2e/collections/spells.json")
            ];
    
            Promise.all(spellFilePromises).then((jsonCollections) => {
                //hardcoded because I think these should be defaults, sue me
                var defaultSources = ["pathfinder player core", "pathfinder player core 2"];

                jsonCollections.forEach((c: any) => this.fullCatalog = this.fullCatalog.concat(c.map((j: any) => new Spell(j))));
                this.fullCatalog = this.fullCatalog.sort((a,b) => { return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1 });
    
                //setup catalog selection
                viewModel.spellCatalog2e(this.fullCatalog);
    
                var spellListBox: HTMLInputElement = this.baseElement.querySelector("#spell-listbox") as HTMLInputElement;
                spellListBox.value = this.fullCatalog[0].name;
                viewModel.spell2e(this.fullCatalog[0]);
    
                spellListBox.addEventListener("change", event => {
                    let listBox: HTMLInputElement = event.target as HTMLInputElement
                    var spell = this.fullCatalog.find(spell => spell.name == listBox.value);
                    viewModel.spell2e(spell);
                });
    
                //setup catalog filters
                this.baseElement.querySelector("#filter-name").addEventListener('input', event => { this.filterCatalog(viewModel); });
                this.baseElement.querySelector("#filter-tags").addEventListener('input', event => { this.filterCatalog(viewModel); });
    
                setupFilterToggle(this.baseElement.querySelector("#category-filter-toggle"), this.baseElement.querySelector("#category-filters"));
                setupFilterToggle(this.baseElement.querySelector("#cantrip-filter-toggle"), this.baseElement.querySelector("#cantrip-filters"));
                setupFilterToggle(this.baseElement.querySelector("#level-filter-toggle"), this.baseElement.querySelector("#level-filters"));
                setupFilterToggle(this.baseElement.querySelector("#tradition-filter-toggle"), this.baseElement.querySelector("#tradition-filters"));
                setupFilterToggle(this.baseElement.querySelector("#source-filter-toggle"), this.baseElement.querySelector("#source-filters"));
                setupFilterToggle(this.baseElement.querySelector("#rarity-filter-toggle"), this.baseElement.querySelector("#rarity-filters"));
    
                this.baseElement.querySelectorAll('input[name="cantrip-filter"]').forEach(el => {
                    el.addEventListener('change', event =>{
                        this.filterCatalog(viewModel);
                    });
                });
    
                this.baseElement.querySelectorAll('.rarity-filter').forEach(el => {
                    el.addEventListener('input', event =>{
                        this.filterCatalog(viewModel);
                    });
                });
    
                populateFilterDropDown(this.fullCatalog, this.baseElement.querySelector("#category-filters"), "category", "spells", () => { this.filterCatalog(viewModel); });
                populateFilterDropDown(this.fullCatalog, this.baseElement.querySelector("#level-filters"), "level", "spells", () => { this.filterCatalog(viewModel); }, true);
                populateFilterDropDown(this.fullCatalog, this.baseElement.querySelector("#tradition-filters"), "traditions", "spells", () => { this.filterCatalog(viewModel); });
                populateFilterDropDown(this.fullCatalog, this.baseElement.querySelector("#source-filters"), "source", "spells", () => { this.filterCatalog(viewModel); }, false, defaultSources);
    
                this.baseElement.querySelector("#btn-clear-filters").addEventListener('click', event => {
                    let nameEl: HTMLInputElement = this.baseElement.querySelector("#filter-name") as HTMLInputElement
                    nameEl.value = "";
    
                    let tagsEl: HTMLInputElement = this.baseElement.querySelector("#filter-tags") as HTMLInputElement
                    tagsEl.value = "";
    
                    let cantripUnfiltered: HTMLInputElement = this.baseElement.querySelector("#cantrip-unfiltered") as HTMLInputElement
                    cantripUnfiltered.checked = true; 
    
                    (this.baseElement.querySelectorAll(".catalog-filter") as NodeListOf<HTMLInputElement>).forEach(el => {
                        el.checked = false 
                        if (defaultSources.indexOf(el.getAttribute("data-filterval").toLowerCase()) != -1) {
                            el.checked = true;
                        }
                    });
                    this.filterCatalog(viewModel);
                });
                //executes defaults
                this.filterCatalog(viewModel);
    
                resolve(null);
            });
        });
    }

    filterCatalog(viewModel: SpellViewModel2e) {
        let nameEl = this.baseElement.querySelector("#filter-name") as HTMLInputElement
        var name = nameEl.value;
        let tagsEl = this.baseElement.querySelector("#filter-tags") as HTMLInputElement
        var tags = tagsEl.value.split(";").map(t => t.replace(/\W/g, '').toUpperCase());
        var cantrip = (this.baseElement.querySelector('input[name="cantrip-filter"]:checked') as HTMLInputElement).value;
        var categories = Array.from(this.baseElement.querySelector("#category-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
        var levels = Array.from(this.baseElement.querySelector("#level-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
        var traditions = Array.from(this.baseElement.querySelector("#tradition-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
        var sources = Array.from(this.baseElement.querySelector("#source-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
        var rarities = Array.from(this.baseElement.querySelector("#rarity-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
    
        var filteredCatalog = this.fullCatalog
            .filter(spell => !name || spell.name.replace(/\W/g, '').toUpperCase().indexOf(name.replace(/\W/g, '').toUpperCase()) != -1)
            .filter(spell => (tags.length < 1 || tags.every(t => t.length < 1)) 
                || tags.some(t => spell.traits.value.map((t2: string) => t2.replace(/\W/g, '').toUpperCase()).includes(t)))
            .filter(spell => categories.length < 1 || categories.indexOf(spell.category.replace(/\W/g, '').toUpperCase()) != -1)
            .filter(spell => cantrip == "0" 
                || (cantrip == "1" && spell.traits.value.indexOf("cantrip") != -1)
                || (cantrip == "2" && spell.traits.value.indexOf("cantrip") == -1))
            .filter(spell => levels.length < 1 || (levels.indexOf(spell.level.toString().replace(/\W/g, '').toUpperCase()) != -1))
            .filter(spell => traditions.length < 1 || traditions.some(t => spell.traditions.map((t2: string) => t2.replace(/\W/g, '').toUpperCase()).includes(t)))
            .filter(spell => sources.length < 1 || sources.indexOf(spell.source.replace(/\W/g, '').toUpperCase()) != -1)
            .filter(spell => rarities.length < 1 || rarities.indexOf(spell.traits.rarity.replace(/\W/g, '').toUpperCase()) != -1);
    
        viewModel.spellCatalog2e(filteredCatalog);
    }

    applyToolTip(el: HTMLInputElement) {
        let spell: Spell = this.fullCatalog.find(s => s.name.replace(/\W/g, '').toUpperCase() == el.value.replace(/\[(.*?)\]|\W/g, '').toUpperCase());
        if (spell)
            el.title = spell.fullTextFormatted();
        else
            el.title = "No Description Found";
    }
}

export var spellCatalogController: SpellCatalogController = new SpellCatalogController();
document.addEventListener("DOMContentLoaded", function(){
    spellCatalogController.baseElement = document.getElementById("spellcatalog2e");
});