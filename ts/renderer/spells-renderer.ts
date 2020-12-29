const { ipcRenderer } = require('electron')
import { spellAutoComplete } from "./autocomplete";
import { triggerUnsafeSave } from "./save-tracker-renderer";
import { parseSpellJSON, Spell, SpellComponentProperties } from "../util/spell";

export var spellJSON: Spell[] = [];
var selectedCatalogSpell: Spell;

ipcRenderer.on('send-custom-spells', (event, json) => {
    spellJSON = spellJSON.concat(parseSpellJSON(json));
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
            jsonCollections.forEach((c: any) => spellJSON = spellJSON.concat(parseSpellJSON(c)));
            spellJSON = spellJSON.sort((a,b) => { return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1 });

            //setup catalog selection
            createSpellCatalog(spellJSON);

            var spellListBox: HTMLInputElement = document.getElementById("spell-listbox") as HTMLInputElement;
            spellListBox.value = spellJSON[0].name;
            mapCatalogSpell(spellJSON[0]);

            spellListBox.addEventListener("change", event => {
                let listBox: HTMLInputElement = event.target as HTMLInputElement
                var spell = spellJSON.find(spell => spell.name == listBox.value);
                mapCatalogSpell(spell);
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
                document.querySelectorAll(".catalog-filter").forEach(el => el.setAttribute("checked", "false"));
                filterSpellCatalog();
            });

            //setup add to spellbook button
            document.getElementById("btn-learn-spell").addEventListener('click', event => {
                let bttnEl: HTMLElement = event.target as HTMLElement
                if (!bttnEl.classList.contains("disabled")){
                    var levelStr = selectedCatalogSpell.level;
                    var spellBlock = Array.from(document.querySelectorAll(".spell-block")).find((div) => +div.getAttribute("data-level") == levelStr)
    
                    var inputToUpdate: HTMLInputElement;
                    var firstInput: HTMLInputElement = spellBlock.querySelectorAll(".spell-name")[0] as HTMLInputElement;
                    if (firstInput && !firstInput.value){
                        inputToUpdate = firstInput;
                    }
                    else{
                        var newRow = buildSpellRow(levelStr)
                        inputToUpdate = newRow.querySelector(".spell-name")
                        spellBlock.querySelector("#spells").appendChild(newRow);
                    }
                    inputToUpdate.value = selectedCatalogSpell.name;
                    applySpellTip(inputToUpdate);

                    triggerUnsafeSave();
    
                    bttnEl.classList.add("disabled");
                }
            });

            resolve(null);
        });
    });
}

export function applyAllSpellTips(){
    document.querySelectorAll(".spell-name").forEach(input => {
        applySpellTip(input as HTMLInputElement);
        
        input.addEventListener("change", event => {
            applySpellTip(event.target as HTMLInputElement);
        });
    });
}

export function applySpellTip(el: HTMLInputElement){
    var spell: any = spellJSON.find(s => s.name.replace(/\W/g, '').toUpperCase() == el.value.replace(/\W/g, '').toUpperCase());

    if (spell){
        el.title = buildFormatedSpellText(spell);
    }
    else{
        el.title = "No Description Found";
    }

    if (spell == selectedCatalogSpell){
        document.getElementById("btn-learn-spell").classList.add("disabled");
    }
}

function createSpellCatalog(spellList: Spell[]){
    var spellListBox = document.getElementById("spell-listbox") as HTMLInputElement;
    spellListBox.innerHTML = "";

    spellList.forEach((spell: Spell) => {
        var option = document.createElement("option");
        option.value = spell.name;
        option.innerHTML = spell.name;
        spellListBox.appendChild(option);

        if (selectedCatalogSpell && selectedCatalogSpell.name == spell.name){
            spellListBox.value = spell.name;
        }
    });
}

function mapCatalogSpell(spell: Spell){
    selectedCatalogSpell = spell;
    var classes = spell.classes.join(", ")

    document.getElementById("catalog-source").innerHTML = "Source: " + spell.source;
    document.getElementById("catalog-classes").innerHTML = "Classes: " + classes;
    document.getElementById("catalog-text").innerHTML = buildFormatedSpellText(spell);

    //disabled learn button if it's already learned
    var learnBtn = document.getElementById("btn-learn-spell");
    learnBtn.classList.remove("disabled");

    var levelStr = spell.level;
    var spellBlock = Array.from(document.querySelectorAll(".spell-block")).find(div => +div.getAttribute("data-level") == levelStr);
    (spellBlock.querySelectorAll(".spell-name") as NodeListOf<HTMLInputElement>).forEach(input => {
        if (input.value.toUpperCase() == spell.name.toUpperCase()){
            learnBtn.classList.add("disabled");
        }
    });
}

function filterSpellCatalog(){
    let nameEl = document.getElementById("filter-name") as HTMLInputElement
    var name = nameEl.value;
    var levels = Array.from(document.getElementById("level-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").replace(/\W/g, '').toUpperCase());
    var classes = Array.from(document.getElementById("class-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").toUpperCase());
    var schools = Array.from(document.getElementById("school-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").toUpperCase());
    var sources = Array.from(document.getElementById("source-filters").querySelectorAll(":checked")).map(el => el.getAttribute("data-filterval").toUpperCase());

    var filteredCatalog = spellJSON
        .filter(spell => !name || spell.name.replace(/\W/g, '').toUpperCase().indexOf(name.replace(/\W/g, '').toUpperCase()) != -1)
        .filter(spell => levels.length < 1 || levels.indexOf(spell.level.toString().replace(/\W/g, '').toUpperCase()) != -1)
        .filter(spell => classes.length < 1 || classes.some(c => spell.classes.map((c2: string) => c2.replace(/\W/g, '').toUpperCase()).includes(c)))
        .filter(spell => schools.length < 1 || schools.indexOf(spell.school.replace(/\W/g, '').toUpperCase()) != -1)
        .filter(spell => sources.length < 1 || sources.indexOf(spell.source.replace(/\W/g, '').toUpperCase()) != -1);

    createSpellCatalog(filteredCatalog);
}

//helpers

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

export function buildSpellRow(level: number){
    var spellHTML = 
        `<button type="button" id="btn-remove-spell" class=" col-1 btn btn-danger">-</button>
         <div class="autocomplete col"><input class="form-control spell-input spell-name"></div>`;
    if(level > 0){
        spellHTML+= `<input class="col-1 spell-input spell-prepared print-hidden" type="checkbox">`
    }

    var newRow = document.createElement("div");
    newRow.className = "spell-row row";
    newRow.innerHTML = spellHTML;
    newRow.querySelector("#btn-remove-spell").addEventListener('click', event =>{
        let bttnEl = event.target as HTMLElement
        if ((bttnEl.parentElement.querySelector(".spell-name") as HTMLInputElement).value == selectedCatalogSpell.name){
            document.getElementById("btn-learn-spell").classList.remove("disabled");
        }
        bttnEl.parentElement.remove();
        triggerUnsafeSave();
    });
    if(level > 0){
        newRow.querySelector(".spell-prepared").addEventListener('click', event =>{
            togglePrepared(event.target as HTMLInputElement);
            triggerUnsafeSave();
        });
    }

    newRow.querySelector(".spell-name").addEventListener('change', event =>{
        applySpellTip(event.target as HTMLInputElement);
    });
    newRow.querySelector(".spell-name").addEventListener('input', event => {
        if ((event.target as HTMLInputElement).value.toUpperCase() == selectedCatalogSpell.name.toUpperCase()){
            document.getElementById("btn-learn-spell").classList.add("disabled");
        }
        else{
            document.getElementById("btn-learn-spell").classList.remove("disabled");
        }
    });

    newRow.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', event => {
            triggerUnsafeSave();
        });
    });

    var autoComplete: spellAutoComplete = new spellAutoComplete();
    autoComplete.init(newRow.querySelectorAll('.spell-name'), level.toString());

    return newRow;
}

function togglePrepared(el: HTMLInputElement){
    if (el.checked){
        el.previousElementSibling.firstElementChild.classList.add("prepared");
    }
    else{
        el.previousElementSibling.firstElementChild.classList.remove("prepared");
    }
}

export function togglePreparedSpells(){
    document.querySelectorAll(".spell-prepared").forEach(el => {
        togglePrepared(el as HTMLInputElement);
    });
}

function buildFormatedSpellText(spell: Spell){
    var spellType = spell.school;
    if (spell.level == 0){
        spellType += " Cantrip"
    }
    else{
        var levelFragment;

        if (spell.level == 1)
            levelFragment = "1st"
        else if (spell.level == 2)
            levelFragment = "2nd"
        else if (spell.level == 3)
            levelFragment = "2rd"
        else
            levelFragment = spell.level.toString() + "th"

        spellType = levelFragment + "-level " + spellType
    }
    if (spell.ritual){
        spellType += " (ritual)"
    }

    var fullDescription = spell.higherLevelDescription ? (spell.description + "\n\nAt Higher Levels: " + spell.higherLevelDescription) : spell.description

    var text = 
    `${spellType}\n`
    +`Casting Time: ${spell.castingTime}\n`
    +`Range: ${spell.range}\n`
    +`Components: ${buildRawComponentString(spell.components)}\n`
    +`Duration: ${spell.duration}\n\n`

    +`${fullDescription}`;

    return text;
}

function buildRawComponentString(spellComponents: SpellComponentProperties){
    var raw = "";
    if (spellComponents.verbal){
        raw += "V"
    }
    if (spellComponents.somatic){
        raw += raw.length > 0 ? ", S" : "S";
    } 
    if (spellComponents.material){
        raw += raw.length > 0 ? ", M" : "M";
        raw += " (" + spellComponents.materials + ")"
    }

    return raw;
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

    spellJSON.forEach(spell => {
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