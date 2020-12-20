const { dialog, ipcMain, Menu, MenuItem } = require('electron');
const fs = require('fs');

const saveTracker = require('./save-tracker-main')
const recents = require('./recents')

var savePath = null;

ipcMain.on('send-save-json', (event, json) => {
    fs.writeFile(savePath, JSON.stringify(json), (err) => {
        saveTracker.resetSafeSave();
    });
});

ipcMain.on('check-recent-load', (event, arg) => {
    //property juggling to match focusedWindowProperties usually expected by executeLoad
    var win = event;
    win.webContents = win.sender;

    recents.getRecentsJSON()
        .then((json) => {
            if (json.lastOpen){
                executeLoad(win, json.lastOpen);
            }
            
            updateRecentsMenu(json.recents)
        });
});

function updateSavePath(path){
    savePath = path;
    recents.updateRecents(path)
        .then(recentsArray => { updateRecentsMenu(recentsArray) });
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

    if(path){
        executeLoad(window, path);
    }
    else{
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
            executeLoad(window, result.filePaths[0]);
        });
    }
}

function executeLoad(window, path){
    fs.readFile(path, 'utf-8', (error, data) => {
        updateSavePath(path);
        var json = JSON.parse(data);
        window.webContents.send('send-loaded-json', json);
        saveTracker.resetSafeSave();
    });
}

//this is here instead of menu.js or recents.js to avoid dependancy loop fuckery
//I'm sorry
function updateRecentsMenu(recentsArray){
    var menu = Menu.getApplicationMenu();

    var recentMenu = menu.getMenuItemById("recents");

    if (recentsArray.length == 0){
        recentMenu.submenu.append(new MenuItem({ label: 'No Recent Characters', enabled: false }));
    }
    else{
        //see electron github issues 527 and 8598, there is no official method for clean removal of menu items
        recentMenu.submenu.clear();     //empties the submenu on the backend, but the js objects will still exist in memory in the array
        recentMenu.submenu.items = [];  //empties the js array to solve the above issue

        recentsArray.forEach(character => {
            recentMenu.submenu.append(new MenuItem(
                { 
                    label: character.path,
                    click(item, focusedWindow){
                        loadFromJSON(focusedWindow, character.path);
                    } 
                })
            );
        });
    }
}

module.exports = {newCharacter, saveToJSON, saveAsToJSON, loadFromJSON, updateRecentsMenu};