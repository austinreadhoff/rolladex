import { app, dialog, BrowserWindow, nativeImage } from 'electron';
import { initMenu } from './menu';
import { saveToJSON, compareToSaved } from './json-io';

function createWindow() {
	app.setAboutPanelOptions({
		applicationName: "RollaDex",
		applicationVersion: "0.3.1",
		iconPath: "./img/icon.png"	//Win/Linux only
	})

	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
		icon: nativeImage.createFromPath("./img/icon.png")	//Win/Linux only
	});
	win.maximize();

	initMenu();

	win.loadFile('landing.html');

	//Capture whether the user closed the window (x) or quit the app (cmd+q)
	//ensures that the right thing happens after our below async check for a save dialog
	var exitAction: string = null;
	win.on('close', function(e: any){
		if (!exitAction)
			exitAction = "close";
	});
	app.on('before-quit', function(e: any){
		if (!exitAction)
			exitAction = "quit";
	});

	var forceClose = false;
	win.on('close', function (e: any) {
		let exit = function(){
			forceClose = true;
			if (exitAction == "quit")
				app.quit();
			else
				win.close();
		}

		if (!forceClose){
			e.preventDefault();
			compareToSaved(win).then((safe) => {
				if (!safe){
					var messageBoxOptions = {
						buttons: ["Quit Without Saving", "Save", "Cancel"],
						defaultId: 0,
						title: "Unsaved Changes",
						message: "There are unsaved changes.  Would you like to quit and lose all unsaved data?",
						cancelId: 2
					}
					var quitWithoutSavingDialogResponse = dialog.showMessageBoxSync(messageBoxOptions)
					switch(quitWithoutSavingDialogResponse){
						case 0:
							exit();	
							break;
						case 1:
							saveToJSON(win);
							break;
						case 2:
							break;
						default:
							//shouldn't reach this anyway
					}
				}
				else{
					exit();	
				}
			});
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