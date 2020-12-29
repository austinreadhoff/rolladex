import { ipcRenderer } from "electron";

export function setUpSaveTracking(){
    document.querySelectorAll('input').forEach(input => {
        if (input.classList.contains("attack-stat") 
        || input.classList.contains("misc-counter")
        || input.classList.contains("spell-name")
        || input.classList.contains("catalog-filter")
        || input.classList.contains("ignore")){
            return;   //Handled elsewhere
        }
        else if (input.type == "text"){
            input.addEventListener('input', event => {
                triggerUnsafeSave();
            });
        }
        else if (input.type == "checkbox"){
            input.addEventListener('change', event => {
                triggerUnsafeSave();
            });
        }
        else if (input.type == "radio"){
            input.addEventListener('change', event => {
                triggerUnsafeSave();
            });
        }
    });
    
    document.querySelectorAll('textarea').forEach(input => {
        if (input.classList.contains("ignore")){
            return;
        }
        input.addEventListener('input', event => {
            triggerUnsafeSave();
        });
    });

    document.getElementById("btn-reset-prepared").addEventListener('click', event => {
        triggerUnsafeSave();
    });
}

export function triggerUnsafeSave(){
    let nameEl: HTMLInputElement = document.getElementById("character-name") as HTMLInputElement;
    document.title = "*" + nameEl.value + " - RollaDex";
    ipcRenderer.send('update-save-safety', false);
}