var spellsFilePath = app.getPath('userData') + "/spells.json";

ipcMain.on('request-custom-spells', (event, arg) => {
    getCustomSpells(event.sender);
});

function getCustomSpells(window: any){
    fs.readFile(spellsFilePath, 'utf-8', (error: any, data: any) => {
        if (error){
            //file doesn't exist, likely due to first time running
            var json: any = [];
            fs.writeFile(spellsFilePath, JSON.stringify(json), (err: any) => {
                window.webContents.send('send-custom-spells', json);
            });
        }
        else{
            window.webContents.send('send-custom-spells', JSON.parse(data));
        }
    });
}

module.exports =  {spellsFilePath};