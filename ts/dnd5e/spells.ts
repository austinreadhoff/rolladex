import { CatalogController, getJSON, populateFilterDropDown, setupFilterToggle } from "../shared/catalog";
import { Spell } from "./spell";
import { SpellViewModel5e } from "./viewmodel";

class SpellCatalogController implements CatalogController<Spell> {
    fullCatalog: Spell[] = [];
    baseElement: HTMLElement;

    loadData(viewModel: SpellViewModel5e) {
        return new Promise((resolve, reject) => {
            var spellFilePromises = [
                getJSON("../dnd5e/spells/srd.json"),
                getJSON("../dnd5e/spells/phb.json"),
                getJSON("../dnd5e/spells/xanathars.json"),
                getJSON("../dnd5e/spells/tashas.json")
            ];
    
            Promise.all(spellFilePromises).then((jsonCollections) => {
                jsonCollections.forEach((c: any) => this.fullCatalog = this.fullCatalog.concat(c.map((j: any) => new Spell(j))));
                this.fullCatalog = this.fullCatalog.sort((a,b) => { return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1 });
    
                //setup catalog selection
                viewModel.spellCatalog5e(this.fullCatalog);
    
                var spellListBox: HTMLInputElement = this.baseElement.querySelector("#spell-listbox") as HTMLInputElement;
                spellListBox.value = this.fullCatalog[0].name;
                viewModel.spell5e(this.fullCatalog[0]);
    
                spellListBox.addEventListener("change", event => {
                    let listBox: HTMLInputElement = event.target as HTMLInputElement
                    var spell = this.fullCatalog.find(spell => spell.name == listBox.value);
                    viewModel.spell5e(spell);
                });
    
                //setup catalog filters
                this.baseElement.querySelector("#filter-name").addEventListener('input', event => { this.filterCatalog(viewModel); });
    
                setupFilterToggle(this.baseElement.querySelector("#level-filter-toggle"), this.baseElement.querySelector("#level-filters"));
                setupFilterToggle(this.baseElement.querySelector("#class-filter-toggle"), this.baseElement.querySelector("#class-filters"));
                setupFilterToggle(this.baseElement.querySelector("#school-filter-toggle"), this.baseElement.querySelector("#school-filters"));
                setupFilterToggle(this.baseElement.querySelector("#source-filter-toggle"), this.baseElement.querySelector("#source-filters"));
    
                populateFilterDropDown(this.fullCatalog, this.baseElement.querySelector("#level-filters"), "level", "spells", () => { this.filterCatalog(viewModel) }, true);
                populateFilterDropDown(this.fullCatalog, this.baseElement.querySelector("#class-filters"), "classes", "spells", () => { this.filterCatalog(viewModel) });
                populateFilterDropDown(this.fullCatalog, this.baseElement.querySelector("#school-filters"), "school", "spells", () => { this.filterCatalog(viewModel) });
                populateFilterDropDown(this.fullCatalog, this.baseElement.querySelector("#source-filters"), "source", "spells", () => { this.filterCatalog(viewModel) });
    
                this.baseElement.querySelector("#btn-clear-filters").addEventListener('click', event => {
                    let nameEl: HTMLInputElement = this.baseElement.querySelector("#filter-name") as HTMLInputElement
                    nameEl.value = "";
                    (this.baseElement.querySelectorAll(".catalog-filter") as NodeListOf<HTMLInputElement>).forEach(el => el.checked = false);
                    this.filterCatalog(viewModel);
                });
    
                resolve(null);
            });
        });
    }

    filterCatalog(viewModel: SpellViewModel5e) {
        let nameEl = this.baseElement.querySelector("#filter-name") as HTMLInputElement
        var name = nameEl.value;
        var levels = Array.from(this.baseElement.querySelector("#level-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
        var classes = Array.from(this.baseElement.querySelector("#class-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
        var schools = Array.from(this.baseElement.querySelector("#school-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
        var sources = Array.from(this.baseElement.querySelector("#source-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());

        var filteredCatalog = this.fullCatalog
            .filter(spell => !name || spell.name.replace(/\W/g, '').toUpperCase().indexOf(name.replace(/\W/g, '').toUpperCase()) != -1)
            .filter(spell => levels.length < 1 || levels.indexOf(spell.level.toString().replace(/\W/g, '').toUpperCase()) != -1)
            .filter(spell => classes.length < 1 || classes.some(c => spell.classes.map((c2: string) => c2.replace(/\W/g, '').toUpperCase()).includes(c)))
            .filter(spell => schools.length < 1 || schools.indexOf(spell.school.replace(/\W/g, '').toUpperCase()) != -1)
            .filter(spell => sources.length < 1 || sources.indexOf(spell.source.replace(/\W/g, '').toUpperCase()) != -1);

        viewModel.spellCatalog5e(filteredCatalog);
    }

    applyToolTip(el: HTMLInputElement) {
        let spell: Spell = this.fullCatalog.find(s => s.name.replace(/\W/g, '').toUpperCase() == el.value.replace(/\[(.*?)\]|\((.*?)\)|\{(.*?)\}|\W/g, '').toUpperCase());
        if (spell)
            el.title = spell.fullTextFormatted();
        else
            el.title = "No Description Found";
    }
}

export var spellCatalogController: SpellCatalogController = new SpellCatalogController();
document.addEventListener("DOMContentLoaded", function(){
    spellCatalogController.baseElement = document.getElementById("spellcatalog5e");
});