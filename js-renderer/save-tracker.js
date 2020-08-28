document.addEventListener("DOMContentLoaded", function(){
    document.querySelectorAll('input').forEach(input => {
        if (input.type == "text"){
            input.addEventListener('input', event => {
                triggerUnsafeSave();
            });
        }
        if (input.type == "checkbox"){
            input.addEventListener('change', event => {
                triggerUnsafeSave();
            });
        }
    });
    
    document.querySelectorAll('textarea').forEach(input => {
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
});

function triggerUnsafeSave(){
    document.title = "*" + document.getElementById("character-name").value + " - RollaDex";
    ipcRenderer.send('update-save-safety', false);
}