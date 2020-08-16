const { dialog, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');

var savePath = null;

ipcMain.on('send-save-json', (event, json) => {
    fs.writeFile(savePath, JSON.stringify(json), (err) => {
        //lol, who needs error handling
    });
    //launchJSONSaveDialog(json)
});

function newCharacter(){
    savePath = null;
}

function saveToJSON(){
    if (savePath) {
        BrowserWindow.getFocusedWindow().webContents.send('request-save-json');
    }
    else{
        saveAsToJSON();
    }
}

function saveAsToJSON(){
    dialog.showSaveDialog({}).then(result => {
        savePath = result.filePath;
        BrowserWindow.getFocusedWindow().webContents.send('request-save-json');
    });
    //BrowserWindow.getFocusedWindow().webContents.send('request-save-json');
}

function launchJSONSaveDialog(json){
    dialog.showSaveDialog({}).then(result => {
        fs.writeFile(result.filePath, JSON.stringify(json), (err) => {
            //lol, who needs error handling
        });
    });
}

function loadFromJSON(){
    dialog.showOpenDialog().then(result => {
        fs.readFile(result.filePaths[0], 'utf-8', (error, data) => {
            savePath = result.filePaths[0];
            var json = JSON.parse(data);
            BrowserWindow.getFocusedWindow().webContents.send('send-loaded-json', json);
        })
    });

}

module.exports = {newCharacter, saveToJSON, saveAsToJSON, loadFromJSON};