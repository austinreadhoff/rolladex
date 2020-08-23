const { BrowserWindow } = require('electron');

function switchTab(tabId){
    BrowserWindow.getFocusedWindow().webContents.send('send-switch-tab', tabId);
}

module.exports = {switchTab};