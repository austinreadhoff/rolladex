var safeToSave = true;

export function triggerUnsafeSave() { safeToSave = false; }
export function resetSafeSave() { safeToSave = true; }
export function SafeToSave() { return safeToSave; } 

ipcMain.on('update-save-safety', (event, updatedValue) => {
    safeToSave = updatedValue;
});