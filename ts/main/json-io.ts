import { ipcMain, OpenDialogOptions, SaveDialogOptions, dialog } from "electron";
import { getRecentsJSON, updateRecents, updateRecentsMenu } from './recents';
const fs = require('fs');

var savePath: string = "";

ipcMain.on('send-save-json', (event: any, json: any) => {
    fs.writeFile(savePath, JSON.stringify(json), (err: any) => {});
});

ipcMain.on('check-recent-load', (event: any, arg: any) => {
    var win = event.sender.getOwnerBrowserWindow();

    getRecentsJSON()
        .then((json: any) => {
            //leaving commented out in case I change my mind and want this back
            // if (json.lastOpen){
            //     executeLoad(win, json.lastOpen, true);
            // }

            win.webContents.send('send-recents-json', json.recents);
            updateRecentsMenu(json.recents)
        });
});

ipcMain.on('load-recent', (event: any, path: string) => {
    var win = event.sender.getOwnerBrowserWindow();
    executeLoad(win, path);
});

function updateSavePath(path: string){
    savePath = path;
    updateRecents(path)
        .then((recentsArray: any) => { updateRecentsMenu(recentsArray) });
}

//returns false if leaving the current window is unsafe, and a warning should be shown
export function compareToSaved(window: Electron.BrowserWindow): Promise<boolean> {
    return new Promise((resolve, reject) => {
        let currentUrl = window.webContents.getURL();
        if (currentUrl.indexOf("landing") != -1){
            resolve(true);
            return;
        }
    
        if (!savePath){
            resolve(false);
            return;
        }
        
        fs.readFile(savePath, 'utf-8', (error: any, sourceData: any) => {
            window.webContents.send('request-save-json', 'send-save-json-to-check');
            
            ipcMain.removeAllListeners('send-save-json-to-check');
            ipcMain.on('send-save-json-to-check', (event: any, jsonForCompare: any) => { 
                resolve(sourceData === JSON.stringify(jsonForCompare));
                return;
            });
        });
    });
}

export function newCharacter(window: Electron.BrowserWindow){
    compareToSaved(window).then((safe) => {
        if (!safe){
            var messageBoxOptions = {
                buttons: ["Leave Without Saving", "Save", "Cancel"],
                defaultId: 0,
                title: "Unsaved Changes",
                message: "There are unsaved changes.  Would you like to discard all unsaved data?",
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
        window.loadFile("landing.html");
    })
}

export function saveToJSON(window: Electron.BrowserWindow){
    if (savePath) {
        window.webContents.send('request-save-json', 'send-save-json');
    }
    else{
        saveAsToJSON(window);
    }
}

export function saveAsToJSON(window: Electron.BrowserWindow){
    var saveDialogOptions: SaveDialogOptions = {
        title: "Save",
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
            window.webContents.send('request-save-json', 'send-save-json');
        }
    });
}

export function loadFromJSON(window: Electron.BrowserWindow, path: string){
    compareToSaved(window).then((safe) => {
        if (!safe){
            var messageBoxOptions = {
                buttons: ["Load Without Saving", "Save", "Cancel"],
                defaultId: 0,
                title: "Unsaved Changes",
                message: "There are unsaved changes.  Would you like to discard all unsaved data?",
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
                title: "Load", 
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
    });
}

function executeLoad(window: Electron.BrowserWindow, path: string, delay: boolean = false){
    fs.readFile(path, 'utf-8', (error: any, data: any) => {
        updateSavePath(path);
        let json = JSON.parse(data);

        let game = json.hasOwnProperty("game") ? json.game : "dnd5e";
        let currentUrl = window.webContents.getURL();

        if (game == "dnd5e" && currentUrl.indexOf("dnd5e") == -1)
            window.loadFile("dnd5e/sheet.html").then(() => { sendJSONToPage(window, json, delay) });

        else if (game == "pf2e" && currentUrl.indexOf("pf2e") == -1)
            window.loadFile("pf2e/sheet.html").then(() => { sendJSONToPage(window, json, delay) });

        else if (game == "gm" && currentUrl.indexOf("gm") == -1)
            window.loadFile("gm/index.html").then(() => { sendJSONToPage(window, json, delay) });

        else{
            sendJSONToPage(window, json);
        }
    });
}

//The delay is necessary for loading the most recent file on launch.
//I gave up figuring out why and I hate it as much as you do.
function sendJSONToPage(window: Electron.BrowserWindow, json: any, delay: boolean = false){
    if (delay){
        setTimeout(() => {
            window.webContents.send('send-loaded-json', json);
        }, 500);
    }
    else{
        window.webContents.send('send-loaded-json', json);
    }
}