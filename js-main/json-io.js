const { dialog, ipcMain } = require('electron');
const fs = require('fs');
const saveTracker = require('./save-tracker')
const recents = require('./recents')

var savePath = null;

ipcMain.on('send-save-json', (event, json) => {
    fs.writeFile(savePath, JSON.stringify(json), (err) => {
        saveTracker.resetSafeSave();
    });
});

function updateSavePath(path){
    savePath = path;
    recents.updateLastOpen(path);
}

function newCharacter(window){
    if (!saveTracker.SafeToSave()){
        var messageBoxOptions = {
            buttons: ["Clear Without Saving", "Save Character", "Cancel"],
            defaultId: 0,
            title: "Unsaved Changes",
            message: "There are unsaved changes to this character.  Would you like to create a new one and lose all unsaved data?",
            cancelId: 2
        }
        var loadWithoutSavingDialogResponse = dialog.showMessageBoxSync(messageBoxOptions)
        switch(loadWithoutSavingDialogResponse){
            case 0:
                break;
            case 1:
                saveToJSON(window);
                return;
            case 2:
                return;
            default:
                //shouldn't reach this anyway
        }
    }

    updateSavePath(null);
    saveTracker.resetSafeSave();
    window.reload();
}

function saveToJSON(window){
    if (savePath) {
        window.webContents.send('request-save-json');
    }
    else{
        saveAsToJSON(window);
    }
}

function saveAsToJSON(window){
    var saveDialogOptions = {
        title: "Save Character",
        defaultPath: "Untitled.json",
        filters: [
            {
                name: 'JSON',
                extensions: ['json']
            }
        ],
        properties: ["createDirectory", "promptToCreate"]
    }

    dialog.showSaveDialog(saveDialogOptions).then(result => {
        if (!result.canceled){
            updateSavePath(result.filePath);
            window.webContents.send('request-save-json');
        }
    });
}

function loadFromJSON(window, path){
    if(path){
        //loading on open
        fs.readFile(path, 'utf-8', (error, data) => {
            var json = JSON.parse(data);
            window.webContents.send('send-loaded-json', json);
        });
    }
    else{
        if (!saveTracker.SafeToSave()){
            var messageBoxOptions = {
                buttons: ["Load Without Saving", "Save Character", "Cancel"],
                defaultId: 0,
                title: "Unsaved Changes",
                message: "There are unsaved changes to this character.  Would you like to load a different one and lose all unsaved data?",
                cancelId: 2
            }
            var loadWithoutSavingDialogResponse = dialog.showMessageBoxSync(messageBoxOptions)
            switch(loadWithoutSavingDialogResponse){
                case 0:
                    break;
                case 1:
                    saveToJSON(window);
                    return;
                case 2:
                    return;
                default:
                    //shouldn't reach this anyway
            }
        }
    
        var openDialogOptions = { 
            title: "Load Character", 
            filters: [
                {
                    name: 'JSON',
                    extensions: ['json']
                }
            ],
            properties: ["openFile"] 
        }
    
        dialog.showOpenDialog(openDialogOptions).then(result => {
            fs.readFile(result.filePaths[0], 'utf-8', (error, data) => {
                updateSavePath(result.filePaths[0]);
                var json = JSON.parse(data);
                window.webContents.send('send-loaded-json', json);
                saveTracker.resetSafeSave();
            })
        });
    }
}

module.exports = {newCharacter, saveToJSON, saveAsToJSON, loadFromJSON};