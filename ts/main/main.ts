import { app, dialog, BrowserWindow, nativeImage } from 'electron';
import { createDockMenu, initMenu, setMenuMode, setUserTasks } from './menu';
import { saveToJSON, compareToSaved } from './json-io';
import { addWindow, getAllWindows, getMenuModeForWindow, removeWindow } from './window-mgmt';

export function createWindow() {
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

	win.loadFile('landing.html');
	addWindow(win);

	var forceClose = false;
	win.on('close', function (e: any) {
		let exit = function(){
			forceClose = true;
			removeWindow(win);
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
							//cancel
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
app.whenReady().then(() => {
	app.setAboutPanelOptions({
		applicationName: "RollaDex",
		applicationVersion: "2025.10.22",
		iconPath: "./img/icon.png"	//Win/Linux only
	});

	createWindow();
	initMenu();			//top menu
	createDockMenu();	//macos dock menu
	setUserTasks();		//windows/linux taskbar menu

	//necessary boilerplate for handling multiple windows on WindowsOS
	const gotTheLock = app.requestSingleInstanceLock();
	if (!gotTheLock) {
		app.quit();
	} 
	else {
		app.on('second-instance', (_event, commandLine, _workingDirectory) => {
			const newWindowArg = '--new-window';
			if (commandLine.includes(newWindowArg)) {
				createWindow();
			}
		});
	}

	app.on('browser-window-focus', (event, focusedWindow) => {
		setMenuMode(getMenuModeForWindow(focusedWindow));
	});
});

app.on('before-quit', function(e: any){
	e.preventDefault();
	var windows = Array.from(getAllWindows()).map(w => w.window);
	Promise.all(windows.map(w => compareToSaved(w)))
	.then((results) => {
		if (results.some(safeToQuit => !safeToQuit)) {
			var messageBoxOptions = {
				buttons: ["Quit Without Saving", "Save", "Cancel"],
				defaultId: 0,
				title: "Unsaved Changes",
				message: "There are unsaved changes.  Would you like to quit and lose all unsaved data?",
				cancelId: 2
			}
			var quitWithoutSavingDialogResponse = dialog.showMessageBoxSync(messageBoxOptions)
			switch (quitWithoutSavingDialogResponse) {
				case 0:
					app.exit();
					break;
				case 1:
					windows.forEach((w, i) => {
						if (!results[i]) saveToJSON(w);
					});
					break;
				case 2:
					//cancel
					break;
				default:
					// shouldn't reach this anyway
			}
		} else {
			app.exit();
		}
	});
});

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