const { BrowserWindow, dialog, shell } = require('electron');
const fs = require('fs');
const spells = require('./spells');

function switchTab(tabId){
    BrowserWindow.getFocusedWindow().webContents.send('send-switch-tab', tabId);
}

function printToPDF(window){
    var printDialogOptions = {
        title: "Export Character Character Sheet",
        defaultPath: "Untitled.pdf",
        filters: [
            {
                name: 'pdf',
                extensions: ['pdf']
            }
        ],
        properties: ["createDirectory", "promptToCreate"]
    }

    dialog.showSaveDialog(printDialogOptions).then(result => { 
        window.webContents.printToPDF({}).then(data => {
            fs.writeFile(result.filePath, data, (err) => {
                //done
            });
        });
    });
}

function openCustomSpells(){
    shell.openPath(spells.spellsFilePath);
}

module.exports = {switchTab, printToPDF, openCustomSpells};