const {ipcRenderer} = require('electron')

var spellJSON = [];
var selectedCatalogSpell;

ipcRenderer.on('send-custom-spells', (event, json) => {
    spellJSON = spellJSON.concat(json);
});

function loadSpellData(){
    ipcRenderer.send('request-custom-spells');
    return new Promise((resolve, reject) => {
        var spellFilePromises = [
            getJSON("./spells/srd.json"),
            getJSON("./spells/phb.json"),
            getJSON("./spells/xanathars.json"),
            getJSON("./spells/tashas.json")
        ];

        Promise.all(spellFilePromises).then((jsonCollections) => {
            jsonCollections.forEach(c => spellJSON = spellJSON.concat(c));
            spellJSON = spellJSON.sort((a,b) => { return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1 });

            //setup catalog selection
            createSpellCatalog(spellJSON);

            var spellListBox = document.getElementById("spell-listbox");
            spellListBox.value = spellJSON[0].name;
            mapCatalogSpell(spellJSON[0]);

            spellListBox.addEventListener("change", event => {
                var spell = spellJSON.find(spell => spell.name == event.target.value);
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
                document.getElementById("filter-name").value = "";
                document.querySelectorAll(".catalog-filter").forEach(el => el.checked = false);
                filterSpellCatalog();
            });

            //setup add to spellbook button
            document.getElementById("btn-learn-spell").addEventListener('click', event => {
                if (!event.target.classList.contains("disabled")){
                    var levelStr = selectedCatalogSpell.level;
                    var spellBlock = Array.from(document.querySelectorAll(".spell-block")).find(div => div.dataset.level == levelStr)
    
                    var inputToUpdate;
                    var firstInput = spellBlock.querySelectorAll(".spell-name")[0];
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
    
                    event.target.classList.add("disabled");
                }
            });

            resolve();
        });
    });
}

function applyAllSpellTips(){
    document.querySelectorAll(".spell-name").forEach(input => {
        applySpellTip(input);
        
        input.addEventListener("change", event => {
            applySpellTip(event.target);
        });
    });
}

function applySpellTip(el){
    spell = spellJSON.find(s => s.name.replace(/\W/g, '').toUpperCase() == el.value.replace(/\W/g, '').toUpperCase());

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

function createSpellCatalog(spellList){
    var spellListBox = document.getElementById("spell-listbox");
    spellListBox.innerHTML = "";

    spellList.forEach(spell => {
        var option = document.createElement("option");
        option.value = spell.name;
        option.innerHTML = spell.name;
        spellListBox.appendChild(option);

        if (selectedCatalogSpell && selectedCatalogSpell.name == spell.name){
            spellListBox.value = spell.name;
        }
    });
}

function mapCatalogSpell(spell){
    selectedCatalogSpell = spell;
    var classes = spell.classes.join(", ")

    document.getElementById("catalog-source").innerHTML = "Source: " + spell.source;
    document.getElementById("catalog-classes").innerHTML = "Classes: " + classes;
    document.getElementById("catalog-text").innerHTML = buildFormatedSpellText(spell);

    //disabled learn button if it's already learned
    var learnBtn = document.getElementById("btn-learn-spell");
    learnBtn.classList.remove("disabled");

    var levelStr = spell.level;
    var spellBlock = Array.from(document.querySelectorAll(".spell-block")).find(div => div.dataset.level == levelStr)
    spellBlock.querySelectorAll(".spell-name").forEach(input => {
        if (input.value.toUpperCase() == spell.name.toUpperCase()){
            learnBtn.classList.add("disabled");
        }
    });
}

function filterSpellCatalog(){
    var name = document.getElementById("filter-name").value;
    var levels = Array.from(document.getElementById("level-filters").querySelectorAll(":checked")).map(el => el.dataset.filterval.replace(/\W/g, '').toUpperCase());
    var classes = Array.from(document.getElementById("class-filters").querySelectorAll(":checked")).map(el => el.dataset.filterval.replace(/\W/g, '').toUpperCase());
    var schools = Array.from(document.getElementById("school-filters").querySelectorAll(":checked")).map(el => el.dataset.filterval.replace(/\W/g, '').toUpperCase());
    var sources = Array.from(document.getElementById("source-filters").querySelectorAll(":checked")).map(el => el.dataset.filterval.replace(/\W/g, '').toUpperCase());

    var filteredCatalog = spellJSON
        .filter(spell => !name || spell.name.replace(/\W/g, '').toUpperCase().indexOf(name.replace(/\W/g, '').toUpperCase()) != -1)
        .filter(spell => levels.length < 1 || levels.indexOf(spell.level.replace(/\W/g, '').toUpperCase()) != -1)
        .filter(spell => classes.length < 1 || classes.some(c => spell.classes.map(c2 => c2.replace(/\W/g, '').toUpperCase()).includes(c)))
        .filter(spell => schools.length < 1 || schools.indexOf(spell.school.replace(/\W/g, '').toUpperCase()) != -1)
        .filter(spell => sources.length < 1 || sources.indexOf(spell.source.replace(/\W/g, '').toUpperCase()) != -1);

    createSpellCatalog(filteredCatalog);
}

//helpers

function getJSON(path){
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

function buildFormatedSpellText(spell){
    var spellType = spell.school;
    if (spell.level == "0"){
        spellType += " Cantrip"
    }
    else{
        var levelFragment;

        if (spell.level == "1")
            levelFragment = "1st"
        else if (spell.level == "2")
            levelFragment = "2nd"
        else if (spell.level == "3")
            levelFragment = "2rd"
        else
            levelFragment = spell.level + "th"

        spellType = levelFragment + "-level " + spellType
    }
    if (spell.ritual){
        spellType += " (ritual)"
    }

    var fullDescription = spell.higher_levels ? (spell.description + "\n\nAt Higher Levels: " + spell.higher_levels) : spell.description

    var text = 
    `${spellType}\n`
    +`Casting Time: ${spell.casting_time}\n`
    +`Range: ${spell.range}\n`
    +`Components: ${buildRawComponentString(spell.components)}\n`
    +`Duration: ${spell.duration}\n\n`

    +`${fullDescription}`;

    return text;
}

function buildRawComponentString(spellComponents){
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

function setupFilterToggle(toggleEl, filterUl){
    toggleEl = document.getElementById(toggleEl);
    filterUl = document.getElementById(filterUl);

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

function populateFilterDropDown(filterEl, property){
    var options = [];

    spellJSON.forEach(spell => {
        if(Array.isArray(spell[property])){
            spell[property].forEach(x => {
                if (options.indexOf(x.toUpperCase()) == -1){
                    options.push(x.toUpperCase());
                }
            });
        }
        else{
            if (options.indexOf(spell[property].toUpperCase()) == -1){
                options.push(spell[property].toUpperCase());
            }
        }
    });

    options.sort(); //handles strings
    options.sort((a,b) => { return a-b });  //handles numbers without 1, 10, 2...

    options.forEach(option => {
        var el = document.createElement("li");
        el.classList = "form-check"
        el.innerHTML = 
        `<input class="form-check-input catalog-filter ${property}-filter" type="checkbox" id="${property}-filter-${option}" data-filterval="${option}">
        <label class="form-check-label" for="${property}-filter-${option}">${option == "0" ? "cantrip" : option.toLowerCase()}</label>`

        document.getElementById(filterEl).appendChild(el);
        
        document.getElementById(`${property}-filter-${option}`).addEventListener('input', event =>{
            filterSpellCatalog();
        });
    });
}