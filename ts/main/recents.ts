import { app, Menu, MenuItem } from 'electron';
import { loadFromJSON } from './json-io';
const fs = require('fs');

var recentsFilePath = app.getPath('userData') + "/recents.json";

export function getRecentsJSON(){
    return new Promise((resolve, reject) => {
        fs.readFile(recentsFilePath, 'utf-8', (error: any, data: any) => {
            if (error){
                //file doesn't exist, likely due to first time running
                var json: any = {"lastOpen" : null, "recents": []};
                fs.writeFile(recentsFilePath, JSON.stringify(json), (err: any) => {
                    resolve(json);
                });
            }
            else{
                resolve(JSON.parse(data));
            }
        });
    });
}

export function updateRecents(path: string){
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (error: any, data: any) => {
            let name: string = "?";
            if (data){
                let json = JSON.parse(data);
                let game = json.game;
    
                if (game == "dnd5e" || game == "pf2e")
                    name = json.characterName;
                else if (game == "gm")
                    name = json.name;
    
                if (name == null || name.trim() === "")
                    name = "?";
            }

            fs.readFile(recentsFilePath, 'utf-8', (error: any, data: any) => {
                var json = JSON.parse(data);
                
                json.lastOpen = path;
        
                if (path){
                    var recents = json.recents;
                    var repeat = false;
        
                    for (let i in recents){
                        if (path == recents[i].path){
                            repeat = true;
                            recents[i].datetime = new Date().toISOString();
                            break;
                        }
                    }
            
                    if(!repeat){
                        recents.push({ "path": path, "name": name, "datetime": new Date().toISOString() });
                    }
        
                    recents.sort((a: any,b: any) => { return new Date(b.datetime).getTime() - new Date(a.datetime).getTime() });
                    if (recents.length > 10){
                        json.recents = recents.slice(0,10);
                    }
                }
            
                fs.writeFile(recentsFilePath, JSON.stringify(json), (err: any) => {
                    return resolve(json.recents);
                });
            });
        });
    });
}

export function updateRecentsMenu(recentsArray: Array<any>){
    var menu = Menu.getApplicationMenu();

    var recentMenu = menu.getMenuItemById("recents");

    var clearItem = new MenuItem(
        {
            label: 'Clear Recently Opened',
            click(item: any, focusedWindow: Electron.BrowserWindow){
                clearRecents().then(() => { updateRecentsMenu([])});
                focusedWindow.webContents.send("send-recents-clear");
            }
        }
    );

    //see electron github issues 527 and 8598, there is no official method for clean removal of menu items
    (recentMenu.submenu as any).clear();     //empties the submenu on the backend, but the js objects will still exist in memory in the array
    recentMenu.submenu.items = [];  //empties the js array to solve the above issue

    if (recentsArray.length == 0){
        recentMenu.submenu.append(new MenuItem({ label: 'No Recent Characters', enabled: false }));
    }
    else{
        recentsArray.forEach(character => {
            recentMenu.submenu.append(new MenuItem(
                { 
                    label: character.path,
                    click(item: any, focusedWindow: Electron.BrowserWindow){
                        loadFromJSON(focusedWindow, character.path);
                    } 
                })
            );
        });

    }

    recentMenu.submenu.append(new MenuItem({ type: 'separator' }));
    recentMenu.submenu.append(clearItem);

    Menu.setApplicationMenu(menu);
}

function clearRecents(){
    return new Promise<void>((resolve, reject) => {
        var json: any = {"lastOpen" : null, "recents": []};
        fs.writeFile(recentsFilePath, JSON.stringify(json), (err: any) => {
            resolve();
        });
    });   
}