const { ipcRenderer } = require('electron')
import { getJSON, populateFilterDropDown, setupFilterToggle } from "../shared/catalog";
import { Feat } from "./feat";
import { viewModel } from "./viewmodel";

//Represents the entire feat catalog, whereas the viewmodel FeatCatalog represents the current filtered version
export var featCatalog: Feat[] = [];

export function loadFeatData(){
    return new Promise((resolve, reject) => {
        var featFilePromises = [
            getJSON("./collections/feats.json")
        ];

        Promise.all(featFilePromises).then((jsonCollections) => {
            jsonCollections.forEach((c: any) => featCatalog = featCatalog.concat(c.map((j: any) => new Feat(j))));
            featCatalog = featCatalog.sort((a,b) => { return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1 });

            //setup catalog selection
            viewModel.featCatalog(featCatalog);

            var featListBox: HTMLInputElement = document.getElementById("feat-listbox") as HTMLInputElement;
            featListBox.value = featCatalog[0].name;
            viewModel.feat(featCatalog[0]);

            featListBox.addEventListener("change", event => {
                let listBox: HTMLInputElement = event.target as HTMLInputElement
                var feat = featCatalog.find(feat => feat.name == listBox.value);
                viewModel.feat(feat);
            });

            //setup catalog filters
            document.getElementById("filter-name").addEventListener('input', event => { filterFeatCatalog(); });
            document.getElementById("filter-tags").addEventListener('input', event => { filterFeatCatalog(); });

            setupFilterToggle("level-filter-toggle", "level-filters");
            setupFilterToggle("source-filter-toggle", "source-filters");
            setupFilterToggle("rarity-filter-toggle", "rarity-filters");

            document.querySelectorAll('.rarity-filter').forEach(el => {
                el.addEventListener('input', event =>{
                    filterFeatCatalog();
                });
            });

            populateFilterDropDown(featCatalog, "level-filters", "level", filterFeatCatalog);
            populateFilterDropDown(featCatalog, "source-filters", "source", filterFeatCatalog);

            document.getElementById("btn-clear-filters").addEventListener('click', event => {
                let nameEl: HTMLInputElement = document.getElementById("filter-name") as HTMLInputElement
                nameEl.value = "";

                let tagsEl: HTMLInputElement = document.getElementById("filter-tags") as HTMLInputElement
                tagsEl.value = "";

                (document.querySelectorAll(".catalog-filter") as NodeListOf<HTMLInputElement>).forEach(el => el.checked = false);
                filterFeatCatalog();
            });

            resolve(null);
        });
    });
}

// export function applyFeatTip(el: HTMLInputElement){
//     var feat: Feat = featCatalog.find(s => s.name.replace(/\W/g, '').toUpperCase() == el.value.replace(/\W/g, '').toUpperCase());

//     if (feat){
//         el.title = feat.fullTextFormatted();
//     }
//     else{
//         el.title = "No Description Found";
//     }
// }

function filterFeatCatalog(){
    let nameEl = document.getElementById("filter-name") as HTMLInputElement
    var name = nameEl.value;
    let tagsEl = document.getElementById("filter-tags") as HTMLInputElement
    var tags = tagsEl.value.split(";").map(t => t.replace(/\W/g, '').toUpperCase());
    var levels = Array.from(document.getElementById("level-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
    var sources = Array.from(document.getElementById("source-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
    var rarities = Array.from(document.getElementById("rarity-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());

    var filteredCatalog = featCatalog
        .filter(feat => !name || feat.name.replace(/\W/g, '').toUpperCase().indexOf(name.replace(/\W/g, '').toUpperCase()) != -1)
        .filter(feat => (tags.length < 1 || tags.every(t => t.length < 1)) 
            || tags.some(t => feat.traits.value.map((t2: string) => t2.replace(/\W/g, '').toUpperCase()).includes(t)))
        .filter(feat => levels.length < 1 || (levels.indexOf(feat.level.toString().replace(/\W/g, '').toUpperCase()) != -1))
        .filter(feat => sources.length < 1 || sources.indexOf(feat.source.replace(/\W/g, '').toUpperCase()) != -1)
        .filter(feat => rarities.length < 1 || rarities.indexOf(feat.traits.rarity.replace(/\W/g, '').toUpperCase()) != -1);

    viewModel.featCatalog(filteredCatalog);
}