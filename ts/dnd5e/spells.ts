const { ipcRenderer } = require('electron')
import { Spell } from "./spell";
import { viewModel } from "./viewmodel";

//Represents the entire spell catalog, whereas the viewmodel SpellCatalog represents the current filtered version
export var spellCatalog: Spell[] = [];

ipcRenderer.on('send-custom-spells', (event, json) => {
    spellCatalog = spellCatalog.concat(json.map((j: any) => new Spell(j)));
});

export function loadSpellData(){
    ipcRenderer.send('request-custom-spells');
    return new Promise((resolve, reject) => {
        var spellFilePromises = [
            getJSON("./spells/srd.json"),
            getJSON("./spells/phb.json"),
            getJSON("./spells/xanathars.json"),
            getJSON("./spells/tashas.json")
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

            setupFilterToggle("level-filter-toggle", "level-filters");
            setupFilterToggle("class-filter-toggle", "class-filters");
            setupFilterToggle("school-filter-toggle", "school-filters");
            setupFilterToggle("source-filter-toggle", "source-filters");

            populateFilterDropDown("level-filters", "level");
            populateFilterDropDown("class-filters", "classes");
            populateFilterDropDown("school-filters", "school");
            populateFilterDropDown("source-filters", "source");

            document.getElementById("btn-clear-filters").addEventListener('click', event => {
                let nameEl: HTMLInputElement = document.getElementById("filter-name") as HTMLInputElement
                nameEl.value = "";
                (document.querySelectorAll(".catalog-filter") as NodeListOf<HTMLInputElement>).forEach(el => el.checked = false);
                filterSpellCatalog();
            });

            resolve(null);
        });
    });
}

export function applySpellTip(el: HTMLInputElement){
    var spell: Spell = spellCatalog.find(s => s.name.replace(/\W/g, '').toUpperCase() == el.value.replace(/\W/g, '').toUpperCase());

    if (spell){
        el.title = spell.fullTextFormatted();
    }
    else{
        el.title = "No Description Found";
    }
}

function filterSpellCatalog(){
    let nameEl = document.getElementById("filter-name") as HTMLInputElement
    var name = nameEl.value;
    var levels = Array.from(document.getElementById("level-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
    var classes = Array.from(document.getElementById("class-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
    var schools = Array.from(document.getElementById("school-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
    var sources = Array.from(document.getElementById("source-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());

    var filteredCatalog = spellCatalog
        .filter(spell => !name || spell.name.replace(/\W/g, '').toUpperCase().indexOf(name.replace(/\W/g, '').toUpperCase()) != -1)
        .filter(spell => levels.length < 1 || levels.indexOf(spell.level.toString().replace(/\W/g, '').toUpperCase()) != -1)
        .filter(spell => classes.length < 1 || classes.some(c => spell.classes.map((c2: string) => c2.replace(/\W/g, '').toUpperCase()).includes(c)))
        .filter(spell => schools.length < 1 || schools.indexOf(spell.school.replace(/\W/g, '').toUpperCase()) != -1)
        .filter(spell => sources.length < 1 || sources.indexOf(spell.source.replace(/\W/g, '').toUpperCase()) != -1);

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
        <label class="form-check-label" for="${property}-filter-${option}">${option == "0" ? "cantrip" : option.toString().toLowerCase()}</label>`

        document.getElementById(filterElId).appendChild(el);
        
        document.getElementById(`${property}-filter-${option}`).addEventListener('input', event =>{
            filterSpellCatalog();
        });
    });
}

//#endregion