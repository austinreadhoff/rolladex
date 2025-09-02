import { SaveDialogOptions, BrowserWindow, dialog } from "electron";
import { IPCMessage } from "../shared/ipc-message";
const fs = require('fs');

//true: forward, false: back
export function switchTab(direction: boolean){
    BrowserWindow.getFocusedWindow().webContents.send(IPCMessage.SendSwitchTab, direction);
}

export function switchToTab(tabId: string){
    BrowserWindow.getFocusedWindow().webContents.send(IPCMessage.SendSwitchToTab, tabId);
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
    window.webContents.send(IPCMessage.SendTakeRest, restType);
}

export function openDiceRoller(window: Electron.BrowserWindow){
    window.webContents.send(IPCMessage.SendOpenDiceRoller);
}