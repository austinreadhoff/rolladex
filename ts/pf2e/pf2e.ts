import { ipcRenderer } from "electron";
import { applyDataBinding, viewModel } from "./viewmodel";

ipcRenderer.on('send-take-rest', (event, restType) => {
    takeRest(); //only one type of rest, doesn't matter which is sent
});

document.addEventListener("DOMContentLoaded", function(){
    applyDataBinding();
    
    document.querySelectorAll('.nav-link').forEach(tab => {
        tab.addEventListener('click', event => {
            switchTab(tab.id.substring(0, tab.id.indexOf("-tab")));
        });
    });
});


//#region Menu Actions

export function switchTab(tabId: string){
    document.querySelectorAll('.nav-link').forEach(t => { t.classList.remove("active"); });
    document.getElementById(tabId + "-tab").classList.add("active");
    
    document.querySelectorAll('.tab-pane').forEach(t => { t.className = "tab-pane"; });
    document.querySelector("#" + tabId).className = "tab-pane show active";

    document.body.scrollTop = 0;
}

function takeRest(){
    let character = viewModel.character();
    let currentHP = +character.currentHP();
    let hpRecovered = character.calculateModifier(+viewModel.character().con())*(+character.level());
    if ((currentHP + hpRecovered) > +character.maxHP()){
        viewModel.character().currentHP(character.maxHP());
        return;
    }

    viewModel.character().currentHP((currentHP + hpRecovered).toString());
}

//#endregion