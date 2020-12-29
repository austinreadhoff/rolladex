import { app, Menu } from 'electron'
import { RestType } from '../util/rest-type';
import { takeRest, printToPDF, openCustomSpells, openDocumentation, switchTab } from './menu-actions'
import { newCharacter, loadFromJSON, saveAsToJSON, saveToJSON } from './json-io-main'

const template: Electron.MenuItemConstructorOptions[] = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Character',
                accelerator: 'CmdOrCtrl+N',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow) {
                    newCharacter(focusedWindow);
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Open Character',
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
                label: 'Save',
                accelerator: 'CmdOrCtrl+S',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                    saveToJSON(focusedWindow);
                }
            },
            {
                label: 'Save As...',
                accelerator: 'CmdOrCtrl+Shift+S',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                    saveAsToJSON(focusedWindow);
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Export To PDF',
                accelerator: 'CmdOrCtrl+P',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
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
                label: 'Stats',
                accelerator: 'CmdOrCtrl+1',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                    switchTab("stats");
                }
            },
            {
                label: 'Bio',
                accelerator: 'CmdOrCtrl+2',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                    switchTab("bio");
                }
            },
            {
                label: 'Spellbook',
                accelerator: 'CmdOrCtrl+3',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                    switchTab("spellbook");
                }
            },
            {
                label: 'Spell Catalog',
                accelerator: 'CmdOrCtrl+4',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                    switchTab("spellcatalog");
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
            },
            {
                label: 'Edit Custom Spells',
                accelerator: 'CmdOrCtrl+Shift+4',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                    openCustomSpells();
                }
            },
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
                label: 'Documentation',
                click(item: Electron.MenuItem, focusedWindow: Electron.BrowserWindow){
                    openDocumentation();
                }
            },
            {
                type: 'separator'
            },
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
    const name = app.getName()
    template.unshift({
        label: name,
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