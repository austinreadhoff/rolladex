const { app, dialog, BrowserWindow, nativeImage } = require('electron')
const io = require('./js-main/json-io')
const menu = require('./js-main/menu')
const saveTracker = require('./js-main/save-tracker')
const spells = require('./js-main/spells')	//not used directly, but gotta load it so it can receive ipc messages

function createWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		},
		icon: nativeImage.createFromPath("./img/icon.png")
	});

	menu.initMenu();

	win.loadFile('index.html');

	win.on('close', function (e) {
		if (!saveTracker.SafeToSave()){
			var messageBoxOptions = {
				buttons: ["Quit Without Saving", "Save Character", "Cancel"],
				defaultId: 0,
				title: "Unsaved Changes",
				message: "There are unsaved changes to this character.  Would you like to quit and lose all unsaved data?",
				cancelId: 2
			}
			var quitWithoutSavingDialogResponse = dialog.showMessageBoxSync(messageBoxOptions)
			switch(quitWithoutSavingDialogResponse){
				case 0:
					break;
				case 1:
					e.preventDefault();
					io.saveToJSON(win);
					break;
				case 2:
					e.preventDefault();
					break;
				default:
					//shouldn't reach this anyway
			}
		}
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})