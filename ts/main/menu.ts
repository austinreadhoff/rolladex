import { app, BrowserWindow, ipcMain, Menu, MenuItem } from 'electron'
import { createWindow } from './main';
import { RestType } from '../shared/rest-type';
import { takeRest, printToPDF, switchTab, switchToTab, openDiceRoller } from './menu-actions'
import { newCharacter, loadFromJSON, saveAsToJSON, saveToJSON } from './json-io'
import { updateMenuModeForWindow } from './window-mgmt';
import { Game } from '../shared/game-type';
import { IPCMessage } from '../shared/ipc-message';

const template: Electron.MenuItemConstructorOptions[] = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New',
                accelerator: 'CmdOrCtrl+N',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                    newCharacter(focusedWindow);
                }
            },
            {
                label: 'New Window',
                accelerator: 'CmdOrCtrl+Shift+N',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                    createWindow();
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Open',
                accelerator: 'CmdOrCtrl+O',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                    loadFromJSON(focusedWindow, null);
                }
            },
            {
                id: 'recents',
                label: 'Open Recent',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                id: 'save',
                label: 'Save',
                accelerator: 'CmdOrCtrl+S',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                    if (focusedWindow.webContents.getURL().indexOf("landing") == -1)
                        saveToJSON(focusedWindow);
                }
            },
            {
                id: 'saveAs',
                label: 'Save As...',
                accelerator: 'CmdOrCtrl+Shift+S',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                    if (focusedWindow.webContents.getURL().indexOf("landing") == -1)
                        saveAsToJSON(focusedWindow);
                }
            },
            {
                type: 'separator'
            },
            {
                id: 'print',
                label: 'Export To PDF',
                accelerator: 'CmdOrCtrl+P',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                    if (focusedWindow.webContents.getURL().indexOf("landing") == -1)
                        printToPDF(focusedWindow);
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                role: 'undo'
            },
            {
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                role: 'cut'
            },
            {
                role: 'copy'
            },
            {
                role: 'paste'
            },
            {
                role: 'pasteAndMatchStyle'
            },
            {
                role: 'delete'
            },
            {
                role: 'selectAll'
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                id: 'viewtabs',
                label: 'Go to Tab',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                label: 'Next Tab',
                accelerator: 'CmdOrCtrl+Tab',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                    switchTab(true);
                }
            },
            {
                label: 'Previous Tab',
                accelerator: 'CmdOrCtrl+Shift+Tab',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                    switchTab(false);
                }
            },
            {
                type: 'separator'
            },
            {
                role: 'resetZoom'
            },
            {
                role: 'zoomIn'
            },
            {
                role: 'zoomOut'
            },
            {
                type: 'separator'
            },
            {
                role: 'togglefullscreen'
            }
        ]
    },
    {
        id: 'actions',
        label: 'Actions',
        submenu: []
    },
    {
        role: 'window',
        submenu: [
            {
                role: 'minimize'
            },
            {
                role: 'close'
            }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                    if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                }
            }
        ]
    }
]

if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [
            {
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                role: 'hide'
            },
            {
                role: 'hideOthers'
            },
            {
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                role: 'quit'
            }
        ]
    })
    // Window menu.
    template[3].submenu = [
        {
            id: 'viewtabs',
            label: 'Go to Tab',
            submenu: []
        },
        {
            type: 'separator'
        },
        {
            label: 'Next Tab',
            accelerator: 'Ctrl+Tab',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                switchTab(true);
            }
        },
        {
            label: 'Previous Tab',
            accelerator: 'Ctrl+Shift+Tab',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                switchTab(false);
            }
        },
        {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
        },
        {
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        },
        {
            label: 'Zoom',
            role: 'zoom'
        },
        {
            type: 'separator'
        },
        {
            label: 'Bring All to Front',
            role: 'front'
        }
    ]
}

export function initMenu(){
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

export function createDockMenu() {
    if (process.platform === 'darwin') {
        app.dock.setMenu(Menu.buildFromTemplate([
        {
            label: 'New Window',
                click() {
                createWindow();
            },
        },
    ]));
    }
}

export function setUserTasks() {
    if (process.platform === 'win32') {
        app.setUserTasks([
            {
                program: process.execPath, // Path to the executable
                arguments: '--new-window', // Custom argument to identify the action
                iconPath: process.execPath, // Path to the icon
                iconIndex: 0,
                title: 'New Window',
                description: 'Create a new app window',
            },
        ]);
    }
}

export function setMenuMode(game: string) {
    let menu = Menu.getApplicationMenu();
    
    let actionsMenu = menu.getMenuItemById("actions");
    (actionsMenu.submenu as any).clear();
    actionsMenu.submenu.items = [];
    
    let tabMenu = menu.getMenuItemById("viewtabs");
    (tabMenu.submenu as any).clear();
    tabMenu.submenu.items = [];
    
    let enableSave = game != "";
    menu.getMenuItemById("save").enabled = enableSave;
    menu.getMenuItemById("saveAs").enabled = enableSave;
    
    menu.getMenuItemById("print").enabled = (game != Game.None && game != Game.GM);
    
    if (game != ""){
        actionsMenu.submenu.append(new MenuItem({
            label: 'Roll Dice',
            accelerator: 'CmdOrCtrl+R',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                openDiceRoller(focusedWindow);
            }
        }));
    }
    
    if (game == Game.Dnd5e){
        actionsMenu.submenu.append(new MenuItem({
            label: 'Short Rest',
            accelerator: 'CmdOrCtrl+K',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                takeRest(focusedWindow, RestType.Short);
            }
        }));
        actionsMenu.submenu.append(new MenuItem({
            label: 'Long Rest',
            accelerator: 'CmdOrCtrl+L',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                takeRest(focusedWindow, RestType.Long);
            }
        }));
    
        tabMenu.submenu.append(new MenuItem({
            label: 'Stats',
            accelerator: 'F1',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                switchToTab("stats");
            }
        }));
        tabMenu.submenu.append(new MenuItem({
            label: 'Bio',
            accelerator: 'F2',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                switchToTab("bio");
            }
        }));
        tabMenu.submenu.append(new MenuItem({
            label: 'Spellbook',
            accelerator: 'F3',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                switchToTab("spellbook");
            }
        }));
        tabMenu.submenu.append(new MenuItem({
            label: 'Spell Catalog',
            accelerator: 'F4',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                switchToTab("spellcatalog5e");
            }
        }));
    }
    
    else if (game == Game.Pf2e){
        actionsMenu.submenu.append(new MenuItem({
            label: 'Take Rest',
            accelerator: 'CmdOrCtrl+K',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                takeRest(focusedWindow, 0);
            }
        }));
    
        tabMenu.submenu.append(new MenuItem({
            label: 'Stats',
            accelerator: 'F1',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                switchToTab("stats");
            }
        }));
        tabMenu.submenu.append(new MenuItem({
            label: 'Feats',
            accelerator: 'F2',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                switchToTab("feats");
            }
        }));
        tabMenu.submenu.append(new MenuItem({
            label: 'Bio',
            accelerator: 'F3',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                switchToTab("bio");
            }
        }));
        tabMenu.submenu.append(new MenuItem({
            label: 'Gear',
            accelerator: 'F4',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                switchToTab("gear");
            }
        }));
        tabMenu.submenu.append(new MenuItem({
            label: 'Spellbook',
            accelerator: 'F5',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                switchToTab("spellbook");
            }
        }));
        tabMenu.submenu.append(new MenuItem({
            label: 'Spell Catalog',
            accelerator: 'F7',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                switchToTab("spellcatalog2e");
            }
        }));
    }
    
    else if (game == Game.GM){
        tabMenu.submenu.append(new MenuItem({
            label: 'Game Info',
            accelerator: 'F1',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                switchToTab("game");
            }
        }));
        tabMenu.submenu.append(new MenuItem({
            label: 'Iniatitive Tracker',
            accelerator: 'F2',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                switchToTab("initiative");
            }
        }));
        tabMenu.submenu.append(new MenuItem({
            label: 'Soundtrack',
            accelerator: 'F3',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                switchToTab("soundtrack");
            }
        }));
        tabMenu.submenu.append(new MenuItem({
            label: 'Reference',
            accelerator: 'F4',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                switchToTab("reference");
            }
        }));
    }
    
    Menu.setApplicationMenu(menu);
}

ipcMain.on(IPCMessage.SetGameMenu, (event: any, game: string) => {
    updateMenuModeForWindow(event.sender.getOwnerBrowserWindow(), game);
    setMenuMode(game);
});