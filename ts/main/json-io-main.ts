import { OpenDialogOptions, SaveDialogOptions } from "electron";

const recents = require('./recents')

var savePath: string = "";

ipcMain.on('send-save-json', (event: any, json: any) => {
    fs.writeFile(savePath, JSON.stringify(json), (err: any) => {
        saveTracker.resetSafeSave();
    });
});

ipcMain.on('check-recent-load', (event: any, arg: any) => {
    //property juggling to match focusedWindowProperties usually expected by executeLoad
    var win = event;
    win.webContents = win.sender;

    recents.getRecentsJSON()
        .then((json: any) => {
            if (json.lastOpen){
                executeLoad(win, json.lastOpen);
            }
            
            updateRecentsMenu(json.recents)
        });
});

function updateSavePath(path: string){
    savePath = path;
    recents.updateRecents(path)
        .then((recentsArray: Array<any>) => { updateRecentsMenu(recentsArray) });
}

function newCharacter(window: Electron.BrowserWindow){
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

    updateSavePath("");
    saveTracker.resetSafeSave();
    window.reload();
}

function saveToJSON(window: Electron.BrowserWindow){
    if (savePath) {
        window.webContents.send('request-save-json');
    }
    else{
        saveAsToJSON(window);
    }
}

function saveAsToJSON(window: Electron.BrowserWindow){
    var saveDialogOptions: SaveDialogOptions = {
        title: "Save Character",
        defaultPath: "Untitled.json",
        filters: [
            {
                name: 'JSON',
                extensions: ['json']
            }
        ],
        properties: ["createDirectory"]
    }

    dialog.showSaveDialog(saveDialogOptions).then((result: any) => {
        if (!result.canceled){
            updateSavePath(result.filePath);
            window.webContents.send('request-save-json');
        }
    });
}

function loadFromJSON(window: Electron.BrowserWindow, path: string){
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
        var openDialogOptions: OpenDialogOptions = { 
            title: "Load Character", 
            filters: [
                {
                    name: 'JSON',
                    extensions: ['json']
                }
            ],
            properties: ["openFile"] 
        }
    
        dialog.showOpenDialog(openDialogOptions).then((result: any) => {
            executeLoad(window, result.filePaths[0]);
        });
    }
}

function executeLoad(window: Electron.BrowserWindow, path: string){
    fs.readFile(path, 'utf-8', (error: any, data: any) => {
        updateSavePath(path);
        var json = JSON.parse(data);
        window.webContents.send('send-loaded-json', json);
        saveTracker.resetSafeSave();
    });
}

//this is here instead of menu.js or recents.js to avoid dependancy loop fuckery
//I'm sorry
function updateRecentsMenu(recentsArray: Array<any>){
    var menu = Menu.getApplicationMenu();

    var recentMenu = menu.getMenuItemById("recents");

    if (recentsArray.length == 0){
        recentMenu.submenu.append(new MenuItem({ label: 'No Recent Characters', enabled: false }));
    }
    else{
        //see electron github issues 527 and 8598, there is no official method for clean removal of menu items
        (recentMenu.submenu as any).clear();     //empties the submenu on the backend, but the js objects will still exist in memory in the array
        recentMenu.submenu.items = [];  //empties the js array to solve the above issue

        recentsArray.forEach(character => {
            recentMenu.submenu.append(new MenuItem(
                { 
                    label: character.path,
                    click(item: any, focusedWindow: Electron.BrowserWindow){
                        loadFromJSON(focusedWindow, character.path);
                    } 
                })
            );
        });
    }
}

module.exports = {newCharacter, saveToJSON, saveAsToJSON, loadFromJSON, updateRecentsMenu};