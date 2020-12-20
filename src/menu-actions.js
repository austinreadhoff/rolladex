const { BrowserWindow, dialog, shell } = require('electron');
const fs = require('fs');
const spells = require('./spells-main');

var documentationFilePath = ("https://github.com/austinread/rolladex/wiki");

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

function openDocumentation(){
    shell.openPath(documentationFilePath);
}

module.exports = {switchTab, printToPDF, openCustomSpells, openDocumentation};