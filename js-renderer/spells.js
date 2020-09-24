var spellJSON;
var spellNames;

function loadSpellData(){
    return new Promise((resolve, reject) => {
        getJSON("./spells/srd.json", (json) => {
            spellJSON = json;
            spellNames = json.map(spell => spell.name)

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
        el.title = 
        `${spell.type}\n`
        +`Casting Time: ${spell.casting_time}\n`
        +`Range: ${spell.range}\n`
        +`Components: ${spell.components.raw}\n`
        +`Duration: ${spell.duration}\n\n`

        +`${spell.description}`;
    }
    else{
        el.title = "No Description Found";
    }
}

function getJSON(path, callback){
    var request = new XMLHttpRequest();
    request.open('GET', path, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            callback(JSON.parse(request.responseText));
        }
    };

    request.send();
}

function initializeAutoComplete(){
    autoComplete(document.getElementsByClassName("spell-name"), spellNames);
}