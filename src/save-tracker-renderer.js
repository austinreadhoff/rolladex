function setUpSaveTracking(){
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
    
    document.getElementById("btn-recover-slots").addEventListener('click', event => {
        triggerUnsafeSave();
    });
}

function triggerUnsafeSave(){
    document.title = "*" + document.getElementById("character-name").value + " - RollaDex";
    ipcRenderer.send('update-save-safety', false);
}