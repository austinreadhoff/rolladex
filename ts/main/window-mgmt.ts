class appWindow  {
    id: number = 0;
    savePath: string = "";
    menuMode: string = "";
    window: Electron.BrowserWindow = null;
}

var windows = new Set<appWindow>();

export function getAllWindows(): Set<appWindow>{
    return windows;
}

export function addWindow(win: Electron.BrowserWindow){
    let appWin = new appWindow();
    appWin.id = win.id;
    appWin.window = win;
    windows.add(appWin);
}

export function removeWindow(win: Electron.BrowserWindow){
    windows.forEach((appWin) => {
        if (appWin.id == win.id){
            windows.delete(appWin);
        }
    });
}

export function updateSavePathForWindow(win: Electron.BrowserWindow, path: string){
    windows.forEach((appWin) => {
        if (appWin.id == win.id){
            appWin.savePath = path;
        }
    });
}

export function getSavePathForWindow(win: Electron.BrowserWindow): string{
    let path = "";
    windows.forEach((appWin) => {
        if (appWin.id == win.id){
            path = appWin.savePath;
        }
    });
    return path;
} 

export function updateMenuModeForWindow(win: Electron.BrowserWindow, mode: string){
    windows.forEach((appWin) => {
        if (appWin.id == win.id){
            appWin.menuMode = mode;
        }
    });
}

export function getMenuModeForWindow(win: Electron.BrowserWindow): string{
    let mode = "";
    windows.forEach((appWin) => {
        if (appWin.id == win.id){
            mode = appWin.menuMode;
        }
    });
    return mode;
}