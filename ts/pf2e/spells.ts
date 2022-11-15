const { ipcRenderer } = require('electron')
import { Spell } from "./spell";
import { viewModel } from "./viewmodel";

//Represents the entire spell catalog, whereas the viewmodel SpellCatalog represents the current filtered version
export var spellCatalog: Spell[] = [];

export function loadSpellData(){
    return new Promise((resolve, reject) => {
        var spellFilePromises = [
            getJSON("./collections/spells.json")
        ];

        Promise.all(spellFilePromises).then((jsonCollections) => {
            jsonCollections.forEach((c: any) => spellCatalog = spellCatalog.concat(c.map((j: any) => new Spell(j))));
            spellCatalog = spellCatalog.sort((a,b) => { return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1 });

            //setup catalog selection
            viewModel.spellCatalog(spellCatalog);

            var spellListBox: HTMLInputElement = document.getElementById("spell-listbox") as HTMLInputElement;
            spellListBox.value = spellCatalog[0].name;
            viewModel.spell(spellCatalog[0]);

            spellListBox.addEventListener("change", event => {
                let listBox: HTMLInputElement = event.target as HTMLInputElement
                var spell = spellCatalog.find(spell => spell.name == listBox.value);
                viewModel.spell(spell);
            });

            //setup catalog filters
            document.getElementById("filter-name").addEventListener('input', event => { filterSpellCatalog(); });
            document.getElementById("filter-tags").addEventListener('input', event => { filterSpellCatalog(); });

            setupFilterToggle("category-filter-toggle", "category-filters");
            setupFilterToggle("cantrip-filter-toggle", "cantrip-filters");
            setupFilterToggle("level-filter-toggle", "level-filters");
            setupFilterToggle("tradition-filter-toggle", "tradition-filters");
            setupFilterToggle("school-filter-toggle", "school-filters");
            setupFilterToggle("source-filter-toggle", "source-filters");
            setupFilterToggle("rarity-filter-toggle", "rarity-filters");

            document.querySelectorAll('input[name="cantrip-filter"]').forEach(el => {
                el.addEventListener('change', event =>{
                    filterSpellCatalog();
                });
            });

            document.querySelectorAll('.rarity-filter').forEach(el => {
                el.addEventListener('input', event =>{
                    filterSpellCatalog();
                });
            });

            populateFilterDropDown("category-filters", "category");
            populateFilterDropDown("level-filters", "level");
            populateFilterDropDown("tradition-filters", "traditions");
            populateFilterDropDown("school-filters", "school");
            populateFilterDropDown("source-filters", "source");

            document.getElementById("btn-clear-filters").addEventListener('click', event => {
                let nameEl: HTMLInputElement = document.getElementById("filter-name") as HTMLInputElement
                nameEl.value = "";

                let tagsEl: HTMLInputElement = document.getElementById("filter-tags") as HTMLInputElement
                tagsEl.value = "";

                let cantripUnfiltered: HTMLInputElement = document.getElementById("cantrip-unfiltered") as HTMLInputElement
                cantripUnfiltered.checked = true; 

                (document.querySelectorAll(".catalog-filter") as NodeListOf<HTMLInputElement>).forEach(el => el.checked = false);
                filterSpellCatalog();
            });

            resolve(null);
        });
    });
}

// export function applySpellTip(el: HTMLInputElement){
//     var spell: Spell = spellCatalog.find(s => s.name.replace(/\W/g, '').toUpperCase() == el.value.replace(/\W/g, '').toUpperCase());

//     if (spell){
//         el.title = spell.fullTextFormatted();
//     }
//     else{
//         el.title = "No Description Found";
//     }
// }

function filterSpellCatalog(){
    let nameEl = document.getElementById("filter-name") as HTMLInputElement
    var name = nameEl.value;
    let tagsEl = document.getElementById("filter-tags") as HTMLInputElement
    var tags = tagsEl.value.split(";").map(t => t.replace(/\W/g, '').toUpperCase());
    var cantrip = (document.querySelector('input[name="cantrip-filter"]:checked') as HTMLInputElement).value;
    var categories = Array.from(document.getElementById("category-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
    var levels = Array.from(document.getElementById("level-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
    var traditions = Array.from(document.getElementById("tradition-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
    var schools = Array.from(document.getElementById("school-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
    var sources = Array.from(document.getElementById("source-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
    var rarities = Array.from(document.getElementById("rarity-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());

    var filteredCatalog = spellCatalog
        .filter(spell => !name || spell.name.replace(/\W/g, '').toUpperCase().indexOf(name.replace(/\W/g, '').toUpperCase()) != -1)
        .filter(spell => (tags.length < 1 || tags.every(t => t.length < 1)) 
            || tags.some(t => spell.traits.value.map((t2: string) => t2.replace(/\W/g, '').toUpperCase()).includes(t)))
        .filter(spell => categories.length < 1 || categories.indexOf(spell.category.replace(/\W/g, '').toUpperCase()) != -1)
        .filter(spell => cantrip == "0" 
            || (cantrip == "1" && spell.traits.value.indexOf("cantrip") != -1)
            || (cantrip == "2" && spell.traits.value.indexOf("cantrip") == -1))
        .filter(spell => levels.length < 1 || (levels.indexOf(spell.level.toString().replace(/\W/g, '').toUpperCase()) != -1))
        .filter(spell => traditions.length < 1 || traditions.some(t => spell.traditions.map((t2: string) => t2.replace(/\W/g, '').toUpperCase()).includes(t)))
        .filter(spell => schools.length < 1 || schools.indexOf(spell.school.replace(/\W/g, '').toUpperCase()) != -1)
        .filter(spell => sources.length < 1 || sources.indexOf(spell.source.replace(/\W/g, '').toUpperCase()) != -1)
        .filter(spell => rarities.length < 1 || rarities.indexOf(spell.traits.rarity.replace(/\W/g, '').toUpperCase()) != -1);

    viewModel.spellCatalog(filteredCatalog);
}

//#region helpers

function getJSON(path: string){
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open('GET', path, true);
    
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                resolve(JSON.parse(request.responseText));
            }
        };
    
        request.send();
    });
}

function setupFilterToggle(toggleElId: string, filterUlId: string){
    let toggleEl = document.getElementById(toggleElId);
    let filterUl = document.getElementById(filterUlId);

    toggleEl.addEventListener('click', event => {
        if (filterUl.hidden) {
            filterUl.hidden = false;
            toggleEl.querySelector(".filter-toggle-icon").classList.add("down");
        } else {
            filterUl.hidden = true;
            toggleEl.querySelector(".filter-toggle-icon").classList.remove("down");
        }
    })
}

function populateFilterDropDown(filterElId: string, property: string){
    var options: any[] = [];

    spellCatalog.forEach(spell => {
        if(Array.isArray(spell[property as keyof Spell])){
            let arr = spell[property as keyof Spell] as any[]
            arr.forEach((x: string) => {
                if (options.indexOf(x.toUpperCase()) == -1){
                    options.push(x.toUpperCase());
                }
            });
        }
        else{
            let str = spell[property as keyof Spell]
            if (options.indexOf(str) == -1){
                options.push(str);
            }
        }
    });

    options.sort(); //handles strings
    options.sort((a,b) => { return a-b });  //handles numbers without 1, 10, 2...

    options.forEach(option => {
        var el = document.createElement("li");
        el.classList.add("form-check");
        el.innerHTML = 
        `<input class="form-check-input catalog-filter ${property}-filter" type="checkbox" id="${property}-filter-${option}" data-filterval="${option}">
        <label class="form-check-label" for="${property}-filter-${option}">${option.toString().toLowerCase()}</label>`

        document.getElementById(filterElId).appendChild(el);
        
        document.getElementById(`${property}-filter-${option}`).addEventListener('input', event =>{
            filterSpellCatalog();
        });
    });
}

//#endregion
