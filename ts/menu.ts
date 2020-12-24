const menuActions = require('./menu-actions')
import {} from 'electron'

const template: Electron.MenuItemConstructorOptions[] = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Character',
                accelerator: 'CmdOrCtrl+N',
                click(item: any, focusedWindow: any) {
                    io.newCharacter(focusedWindow);
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Open Character',
                accelerator: 'CmdOrCtrl+O',
                click(item: any, focusedWindow: any){
                    io.loadFromJSON(focusedWindow, null);
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
                click(item: any, focusedWindow: any){
                    io.saveToJSON(focusedWindow);
                }
            },
            {
                label: 'Save As...',
                accelerator: 'CmdOrCtrl+Shift+S',
                click(item: any, focusedWindow: any){
                    io.saveAsToJSON(focusedWindow);
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Export To PDF',
                accelerator: 'CmdOrCtrl+P',
                click(item: any, focusedWindow: any){
                    menuActions.printToPDF(focusedWindow);
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
                click(item: any, focusedWindow: any){
                    menuActions.switchTab("stats");
                }
            },
            {
                label: 'Bio',
                accelerator: 'CmdOrCtrl+2',
                click(item: any, focusedWindow: any){
                    menuActions.switchTab("bio");
                }
            },
            {
                label: 'Spellbook',
                accelerator: 'CmdOrCtrl+3',
                click(item: any, focusedWindow: any){
                    menuActions.switchTab("spellbook");
                }
            },
            {
                label: 'Spell Catalog',
                accelerator: 'CmdOrCtrl+4',
                click(item: any, focusedWindow: any){
                    menuActions.switchTab("spellcatalog");
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Open Custom Spells',
                accelerator: 'CmdOrCtrl+Shift+4',
                click(item: any, focusedWindow: any){
                    menuActions.openCustomSpells();
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
                click(item: any, focusedWindow: any){
                    menuActions.openDocumentation();
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                click(item: any, focusedWindow: any) {
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

function initMenu(){
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

module.exports = {initMenu};