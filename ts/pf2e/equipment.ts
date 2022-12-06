import { CatalogController, getJSON, populateFilterDropDown, setupFilterToggle } from "../shared/catalog";
import { Gear } from "./gear";
import { viewModel } from "./viewmodel";

class GearCatalogController implements CatalogController<Gear>{
    fullCatalog: Gear[] = [];
    baseElement: HTMLElement;

    loadData(){
        return new Promise((resolve, reject) => {
            var gearFilePromises = [
                getJSON("./collections/gear.json")
            ];
    
            Promise.all(gearFilePromises).then((jsonCollections) => {
                jsonCollections.forEach((c: any) => this.fullCatalog = this.fullCatalog.concat(c.map((j: any) => new Gear(j))));
                this.fullCatalog = this.fullCatalog.sort((a,b) => { return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1 });
    
                //setup catalog selection
                viewModel.gearCatalog(this.fullCatalog);
    
                var gearListBox: HTMLInputElement = this.baseElement.querySelector("#gear-listbox") as HTMLInputElement;
                gearListBox.value = this.fullCatalog[0].name;
                viewModel.gear(this.fullCatalog[0]);
    
                gearListBox.addEventListener("change", event => {
                    let listBox: HTMLInputElement = event.target as HTMLInputElement
                    var gear = this.fullCatalog.find(gear => gear.name == listBox.value);
                    viewModel.gear(gear);
                });
    
                //setup catalog filters
                this.baseElement.querySelector("#filter-name").addEventListener('input', event => { this.filterCatalog(); });
                this.baseElement.querySelector("#filter-tags").addEventListener('input', event => { this.filterCatalog(); });
    
                setupFilterToggle(this.baseElement.querySelector("#level-filter-toggle"), this.baseElement.querySelector("#level-filters"));
                setupFilterToggle(this.baseElement.querySelector("#source-filter-toggle"), this.baseElement.querySelector("#source-filters"));
                setupFilterToggle(this.baseElement.querySelector("#rarity-filter-toggle"), this.baseElement.querySelector("#rarity-filters"));
    
                this.baseElement.querySelectorAll('.rarity-filter').forEach(el => {
                    el.addEventListener('input', event =>{
                        this.filterCatalog();
                    });
                });

                populateFilterDropDown(this.fullCatalog, this.baseElement.querySelector("#level-filters"), "level", () => { this.filterCatalog(); });
                populateFilterDropDown(this.fullCatalog, this.baseElement.querySelector("#source-filters"), "source", () => { this.filterCatalog(); });
    
                this.baseElement.querySelector("#btn-clear-filters").addEventListener('click', event => {
                    let nameEl: HTMLInputElement = this.baseElement.querySelector("#filter-name") as HTMLInputElement
                    nameEl.value = "";
    
                    let tagsEl: HTMLInputElement = this.baseElement.querySelector("#filter-tags") as HTMLInputElement
                    tagsEl.value = "";
    
                    (this.baseElement.querySelectorAll(".catalog-filter") as NodeListOf<HTMLInputElement>).forEach(el => el.checked = false);
                    this.filterCatalog();
                });
    
                resolve(null);
            });
        });
    }

    filterCatalog(){
        let nameEl = this.baseElement.querySelector("#filter-name") as HTMLInputElement
        var name = nameEl.value;
        let tagsEl = this.baseElement.querySelector("#filter-tags") as HTMLInputElement
        var tags = tagsEl.value.split(";").map(t => t.replace(/\W/g, '').toUpperCase());
        var levels = Array.from(this.baseElement.querySelector("#level-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
        var sources = Array.from(this.baseElement.querySelector("#source-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
        var rarities = Array.from(this.baseElement.querySelector("#rarity-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
    
        var filteredCatalog = this.fullCatalog
            .filter(gear => !name || gear.name.replace(/\W/g, '').toUpperCase().indexOf(name.replace(/\W/g, '').toUpperCase()) != -1)
            .filter(gear => (tags.length < 1 || tags.every(t => t.length < 1)) 
                || tags.some(t => gear.traits.value.map((t2: string) => t2.replace(/\W/g, '').toUpperCase()).includes(t)))
            .filter(gear => levels.length < 1 || (levels.indexOf(gear.level.toString().replace(/\W/g, '').toUpperCase()) != -1))
            .filter(gear => sources.length < 1 || sources.indexOf(gear.source.replace(/\W/g, '').toUpperCase()) != -1)
            .filter(gear => rarities.length < 1 || rarities.indexOf(gear.traits.rarity.replace(/\W/g, '').toUpperCase()) != -1);
    
        viewModel.gearCatalog(filteredCatalog);
    }

    applyToolTip(el: HTMLInputElement) {
        //TODO
    }
}

export var gearCatalogController: GearCatalogController = new GearCatalogController();
document.addEventListener("DOMContentLoaded", function(){
    gearCatalogController.baseElement = document.getElementById("craftingcatalog");
});