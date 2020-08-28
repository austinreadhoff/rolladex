const { ipcMain } = require('electron');

var safeToSave = true;

function triggerUnsafeSave() { safeToSave = false; }
function resetSafeSave() { safeToSave = true; }
function SafeToSave() { return safeToSave; } 

ipcMain.on('update-save-safety', (event, updatedValue) => {
    safeToSave = updatedValue;
});

module.exports = {triggerUnsafeSave, resetSafeSave, SafeToSave};