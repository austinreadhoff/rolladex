const { dialog, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');

ipcMain.on('send-save-json', (event, json) => {
    launchJSONSaveDialog(json)
});

function saveToJSON(){
    BrowserWindow.getFocusedWindow().webContents.send('request-save-json');
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
            var json = JSON.parse(data);
            BrowserWindow.getFocusedWindow().webContents.send('send-loaded-json', json);
        })
    });

}

module.exports = {saveToJSON, loadFromJSON};