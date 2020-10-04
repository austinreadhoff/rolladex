const {app, ipcMain} = require('electron');
const fs = require('fs');

var spellsFilePath = app.getPath('userData') + "/spells.json";

ipcMain.on('request-custom-spells', (event, arg) => {
    getCustomSpells(event.sender);
});

function getCustomSpells(window){
    fs.readFile(spellsFilePath, 'utf-8', (error, data) => {
        if (error){
            //file doesn't exist, likely due to first time running
            var json = [];
            fs.writeFile(spellsFilePath, JSON.stringify(json), (err) => {
                window.webContents.send('send-custom-spells', json);
            });
        }
        else{
            window.webContents.send('send-custom-spells', JSON.parse(data));
        }
    });
}

module.exports =  {spellsFilePath};