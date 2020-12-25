import { PrintToPDFOptions, SaveDialogOptions } from "electron";

var documentationFilePath = ("https://github.com/austinread/rolladex/wiki");

function switchTab(tabId: string){
    BrowserWindow.getFocusedWindow().webContents.send('send-switch-tab', tabId);
}

function printToPDF(window: any){
    var printDialogOptions: SaveDialogOptions = {
        title: "Export Character Character Sheet",
        defaultPath: "Untitled.pdf",
        filters: [
            {
                name: 'pdf',
                extensions: ['pdf']
            }
        ],
        properties: ["createDirectory"]
    }

    dialog.showSaveDialog(printDialogOptions).then((result: any) => { 
        window.webContents.printToPDF({}).then((data: any) => {
            fs.writeFile(result.filePath, data, (err: any) => {
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