import { CatalogController, getJSON, populateFilterDropDown, setupFilterToggle } from "../shared/catalog";
import { Feat } from "./feat";
import { viewModel } from "./viewmodel";

class FeatCatalogController implements CatalogController<Feat>{
    fullCatalog: Feat[] = [];
    baseElement: HTMLElement;

    loadData(){
        return new Promise((resolve, reject) => {
            var featFilePromises = [
                getJSON("./collections/feats.json")
            ];
    
            Promise.all(featFilePromises).then((jsonCollections) => {
                jsonCollections.forEach((c: any) => this.fullCatalog = this.fullCatalog.concat(c.map((j: any) => new Feat(j))));
                this.fullCatalog = this.fullCatalog.sort((a,b) => { return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1 });
    
                //setup catalog selection
                viewModel.featCatalog(this.fullCatalog);
    
                var featListBox: HTMLInputElement = document.getElementById("feat-listbox") as HTMLInputElement;
                featListBox.value = this.fullCatalog[0].name;
                viewModel.feat(this.fullCatalog[0]);
    
                featListBox.addEventListener("change", event => {
                    let listBox: HTMLInputElement = event.target as HTMLInputElement
                    var feat = this.fullCatalog.find(feat => feat.name == listBox.value);
                    viewModel.feat(feat);
                });
    
                //setup catalog filters
                document.getElementById("filter-name").addEventListener('input', event => { this.filterCatalog(); });
                document.getElementById("filter-tags").addEventListener('input', event => { this.filterCatalog(); });
    
                setupFilterToggle(this.baseElement.querySelector("#level-filter-toggle"), this.baseElement.querySelector("#level-filters"));
                setupFilterToggle(this.baseElement.querySelector("#type-filter-toggle"), this.baseElement.querySelector("#type-filters"));
                setupFilterToggle(this.baseElement.querySelector("#source-filter-toggle"), this.baseElement.querySelector("#source-filters"));
                setupFilterToggle(this.baseElement.querySelector("#rarity-filter-toggle"), this.baseElement.querySelector("#rarity-filters"));
    
                document.querySelectorAll('.rarity-filter').forEach(el => {
                    el.addEventListener('input', event =>{
                        this.filterCatalog();
                    });
                });
    
                populateFilterDropDown(this.fullCatalog, this.baseElement.querySelector("#level-filters"), "level", () => { this.filterCatalog(); });
                populateFilterDropDown(this.fullCatalog, this.baseElement.querySelector("#type-filters"), "featType", () => { this.filterCatalog(); });
                populateFilterDropDown(this.fullCatalog, this.baseElement.querySelector("#source-filters"), "source", () => { this.filterCatalog(); });
    
                document.getElementById("btn-clear-filters").addEventListener('click', event => {
                    let nameEl: HTMLInputElement = document.getElementById("filter-name") as HTMLInputElement
                    nameEl.value = "";
    
                    let tagsEl: HTMLInputElement = document.getElementById("filter-tags") as HTMLInputElement
                    tagsEl.value = "";
    
                    (document.querySelectorAll(".catalog-filter") as NodeListOf<HTMLInputElement>).forEach(el => el.checked = false);
                    this.filterCatalog();
                });
    
                resolve(null);
            });
        });
    }

    filterCatalog(){
        let nameEl = document.getElementById("filter-name") as HTMLInputElement
        var name = nameEl.value;
        let tagsEl = document.getElementById("filter-tags") as HTMLInputElement
        var tags = tagsEl.value.split(";").map(t => t.replace(/\W/g, '').toUpperCase());
        var levels = Array.from(document.getElementById("level-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
        var types = Array.from(document.getElementById("type-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
        var sources = Array.from(document.getElementById("source-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
        var rarities = Array.from(document.getElementById("rarity-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
    
        var filteredCatalog = this.fullCatalog
            .filter(feat => !name || feat.name.replace(/\W/g, '').toUpperCase().indexOf(name.replace(/\W/g, '').toUpperCase()) != -1)
            .filter(feat => (tags.length < 1 || tags.every(t => t.length < 1)) 
                || tags.some(t => feat.traits.value.map((t2: string) => t2.replace(/\W/g, '').toUpperCase()).includes(t)))
            .filter(feat => levels.length < 1 || (levels.indexOf(feat.level.toString().replace(/\W/g, '').toUpperCase()) != -1))
            .filter(feat => types.length < 1 || (types.indexOf(feat.featType.toString().replace(/\W/g, '').toUpperCase()) != -1))
            .filter(feat => sources.length < 1 || sources.indexOf(feat.source.replace(/\W/g, '').toUpperCase()) != -1)
            .filter(feat => rarities.length < 1 || rarities.indexOf(feat.traits.rarity.replace(/\W/g, '').toUpperCase()) != -1);
    
        viewModel.featCatalog(filteredCatalog);
    }

    applyToolTip(el: HTMLInputElement) {
        //TODO
    }
}

export var featCatalogController: FeatCatalogController = new FeatCatalogController();
document.addEventListener("DOMContentLoaded", function(){
    featCatalogController.baseElement = document.getElementById("featcatalog");
});