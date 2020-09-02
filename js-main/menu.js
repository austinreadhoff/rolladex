const { Menu } = require('electron')
const electron = require('electron')
const app = electron.app

const menuActions = require('./menu-actions')
const io = require('./json-io')

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Character',
                accelerator: 'CmdOrCtrl+N',
                click(item, focusedWindow) {
                    io.newCharacter(focusedWindow);
                    if (focusedWindow) focusedWindow.reload()
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Load Character',
                accelerator: 'CmdOrCtrl+O',
                click(item, focusedWindow){
                    io.loadFromJSON(focusedWindow);
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Save',
                accelerator: 'CmdOrCtrl+S',
                click(item, focusedWindow){
                    io.saveToJSON(focusedWindow);
                }
            },
            {
                label: 'Save As...',
                accelerator: 'CmdOrCtrl+Shift+S',
                click(item, focusedWindow){
                    io.saveAsToJSON(focusedWindow);
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Export To PDF',
                accelerator: 'CmdOrCtrl+P',
                click(item, focusedWindow){
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
                role: 'pasteandmatchstyle'
            },
            {
                role: 'delete'
            },
            {
                role: 'selectall'
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow) {
                    if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Stats',
                accelerator: 'CmdOrCtrl+1',
                click(item, focusedWindow){
                    menuActions.switchTab("stats");
                }
            },
            {
                label: 'Bio',
                accelerator: 'CmdOrCtrl+2',
                click(item, focusedWindow){
                    menuActions.switchTab("bio");
                }
            },
            {
                label: 'Spellbook',
                accelerator: 'CmdOrCtrl+3',
                click(item, focusedWindow){
                    menuActions.switchTab("spellbook");
                }
            },
            {
                type: 'separator'
            },
            {
                role: 'resetzoom'
            },
            {
                role: 'zoomin'
            },
            {
                role: 'zoomout'
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
                role: 'hideothers'
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
    // Edit menu.
    template[1].submenu.push(
        {
            type: 'separator'
        },
        {
            label: 'Speech',
            submenu: [
                {
                    role: 'startspeaking'
                },
                {
                    role: 'stopspeaking'
                }
            ]
        }
    )
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

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)