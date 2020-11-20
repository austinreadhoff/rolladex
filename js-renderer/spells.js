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
            mapSRDCatalogSpell(spellJSON[0]);

            spellListBox.addEventListener("change", event => {
                var spell = spellJSON.find(spell => spell.name == event.target.value);
                mapSRDCatalogSpell(spell);
            });

            //setup catalog filters
            document.getElementById("filter-name").addEventListener('input', event => { filterSpellCatalog(); });
            document.getElementById("filter-level").addEventListener('change', event => { filterSpellCatalog(); });
            document.getElementById("filter-school").addEventListener('change', event => { filterSpellCatalog(); });
            document.getElementById("filter-class").addEventListener('change', event => { filterSpellCatalog(); });
            document.getElementById("filter-source").addEventListener('change', event => { filterSpellCatalog(); });

            populateFilterDropDown("filter-level", "level", false);
            populateFilterDropDown("filter-school", "school", false);
            populateFilterDropDown("filter-class", "classes", true);
            populateFilterDropDown("filter-source", "source", false);

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

        el.title = 
        `${spellType}\n`
        +`Casting Time: ${spell.casting_time}\n`
        +`Range: ${spell.range}\n`
        +`Components: ${buildRawComponentString(spell.components)}\n`
        +`Duration: ${spell.duration}\n\n`

        +`${fullDescription}`;
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

function mapSRDCatalogSpell(spell){
    selectedCatalogSpell = spell;
    var classes = spell.classes.join(", ")
    var fullDescription = spell.higher_levels ? (spell.description + "\n\nAt Higher Levels: " + spell.higher_levels) : spell.description

    document.getElementById("srd-catalog-source").innerHTML = "Source: " + spell.source;
    document.getElementById("srd-catalog-name").innerHTML = spell.name;
    document.getElementById("srd-catalog-level").innerHTML = spell.level == "0" ? "Cantrip" : spell.level;
    document.getElementById("srd-catalog-school").innerHTML = spell.school;
    document.getElementById("srd-catalog-classes").innerHTML = classes;
    document.getElementById("srd-catalog-components").innerHTML = buildRawComponentString(spell.components);
    document.getElementById("srd-catalog-ritual").innerHTML = spell.ritual ? "Yes" : "No";
    document.getElementById("srd-catalog-casting-time").innerHTML = spell.casting_time;
    document.getElementById("srd-catalog-duration").innerHTML = spell.duration;
    document.getElementById("srd-catalog-range").innerHTML = spell.range;
    document.getElementById("srd-catalog-description").value = fullDescription;

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
    var level = document.getElementById("filter-level").value;
    var school = document.getElementById("filter-school").value;
    var _class = document.getElementById("filter-class").value;
    var source = document.getElementById("filter-source").value;

    var filteredCatalog = spellJSON
        .filter(spell => !name || spell.name.replace(/\W/g, '').toUpperCase().indexOf(name.replace(/\W/g, '').toUpperCase()) != -1)
        .filter(spell => !level || spell.level.toUpperCase() == level.toUpperCase())
        .filter(spell => !school || spell.school.toUpperCase() == school.toUpperCase())
        .filter(spell => !_class || spell.classes.find(c => c.toUpperCase() == _class.toUpperCase()) != null)
        .filter(spell => !source || spell.source.toUpperCase() == source.toUpperCase());

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

function populateFilterDropDown(filterEl, property, multi){
    var options = [];

    spellJSON.forEach(spell => {
        if(multi){
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
        var el = document.createElement("option");
        el.value = option;
        el.innerHTML = option == "0" ? "cantrip" : option.toLowerCase();

        document.getElementById(filterEl).appendChild(el);
    });
}