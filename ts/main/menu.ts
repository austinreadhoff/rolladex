import { app, ipcMain, Menu, MenuItem } from 'electron'
import { RestType } from '../shared/rest-type';
import { takeRest, printToPDF, switchTab, switchToTab } from './menu-actions'
import { newCharacter, loadFromJSON, saveAsToJSON, saveToJSON } from './json-io'

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
        submenu: [
            {
                label: 'Short Rest',
                accelerator: 'CmdOrCtrl+R',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                    takeRest(focusedWindow, RestType.Short);
                }
            },
            {
                label: 'Long Rest',
                accelerator: 'CmdOrCtrl+L',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                    takeRest(focusedWindow, RestType.Long);
                }
            }
        ]
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

ipcMain.on('set-game-menu', (event: any, game: string) => {
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

    menu.getMenuItemById("print").enabled = (game != "" && game != "gm");

    if (game == "dnd5e"){
        actionsMenu.submenu.append(new MenuItem({
            label: 'Short Rest',
            accelerator: 'CmdOrCtrl+R',
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
                switchToTab("spellcatalog");
            }
        }));
    }

    else if (game == "pf2e"){
        actionsMenu.submenu.append(new MenuItem({
            label: 'Take Rest',
            accelerator: 'CmdOrCtrl+R',
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
            label: 'Feat Catalog',
            accelerator: 'F6',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                switchToTab("featcatalog");
            }
        }));
        tabMenu.submenu.append(new MenuItem({
            label: 'Spell Catalog',
            accelerator: 'F7',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                switchToTab("spellcatalog");
            }
        }));
        tabMenu.submenu.append(new MenuItem({
            label: 'Equipment Catalog',
            accelerator: 'F8',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                switchToTab("craftingcatalog");
            }
        }));
    }

    else if (game == "gm"){
        tabMenu.submenu.append(new MenuItem({
            label: 'Dice Roller',
            accelerator: 'F1',
            click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                switchToTab("dice");
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
    }

    Menu.setApplicationMenu(menu);
});