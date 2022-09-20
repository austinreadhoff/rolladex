import { SaveDialogOptions, BrowserWindow, dialog, shell } from "electron";
const fs = require('fs');

export function switchTab(tabId: string){
    BrowserWindow.getFocusedWindow().webContents.send('send-switch-tab', tabId);
}

export function printToPDF(window: Electron.BrowserWindow){
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

export function takeRest(window: Electron.BrowserWindow, restType: number){
    window.webContents.send('send-take-rest', restType)
}