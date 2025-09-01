import { ipcMain, OpenDialogOptions, SaveDialogOptions, dialog, BrowserWindow } from "electron";
import { getRecentsJSON, updateRecents, updateRecentsMenu } from './recents';
import { getSavePathForWindow, updateSavePathForWindow } from "./window-mgmt";
const fs = require('fs');

ipcMain.on('send-save-json', (event: any, json: any) => {
    var savePath = getSavePathForWindow(event.sender.getOwnerBrowserWindow());
    fs.writeFile(savePath, JSON.stringify(json), (err: any) => {
        updateSavePath(event.sender.getOwnerBrowserWindow(), savePath);
    })
});

ipcMain.on('check-recent-load', (event: any, arg: any) => {
    var win = event.sender.getOwnerBrowserWindow();

    getRecentsJSON()
        .then((json: any) => {
            win.webContents.send('send-recents-json', json.recents);
            updateRecentsMenu(json.recents)
        });
});

ipcMain.on('load-recent', (event: any, path: string) => {
    var win = event.sender.getOwnerBrowserWindow();
    executeLoad(win, path);
});

function updateSavePath(win: BrowserWindow, path: string){
    updateSavePathForWindow(win, path);
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
    
        let savePath = getSavePathForWindow(window);
        if (!savePath){
            resolve(false);
            return;
        }
        
        var responseChannel = 'send-save-json-to-check-' + window.id;
        ipcMain.once(responseChannel, (event: any, jsonForCompare: any) => { 
            let savePath = getSavePathForWindow(event.sender.getOwnerBrowserWindow());
            fs.readFile(savePath, 'utf-8', (error: any, sourceData: any) => {
                resolve(sourceData === JSON.stringify(jsonForCompare));
                return;
            });
        });

        window.webContents.send('request-save-json', responseChannel);
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
    
        updateSavePath(window, "");
        window.loadFile("landing.html");
    })
}

export function saveToJSON(window: Electron.BrowserWindow){
    if (getSavePathForWindow(window)){
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
            updateSavePath(window, result.filePath);
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

function executeLoad(window: Electron.BrowserWindow, path: string){
    fs.readFile(path, 'utf-8', (error: any, data: any) => {
        updateSavePath(window, path);
        let json = JSON.parse(data);

        let game = json.hasOwnProperty("game") ? json.game : "dnd5e";
        let currentUrl = window.webContents.getURL();

        if (game == "dnd5e" && currentUrl.indexOf("dnd5e") == -1)
            window.loadFile("dnd5e/sheet.html").then(() => { sendJSONToPage(window, json) });

        else if (game == "pf2e" && currentUrl.indexOf("pf2e") == -1)
            window.loadFile("pf2e/sheet.html").then(() => { sendJSONToPage(window, json) });

        else if (game == "gm" && currentUrl.indexOf("gm") == -1)
            window.loadFile("gm/index.html").then(() => { sendJSONToPage(window, json) });

        else{
            sendJSONToPage(window, json);
        }
    });
}

function sendJSONToPage(window: Electron.BrowserWindow, json: any){
    window.webContents.send('send-loaded-json', json);
}