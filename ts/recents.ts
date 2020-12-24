var recentsFilePath = app.getPath('userData') + "/recents.json";

function getRecentsJSON(){
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

function updateRecents(path: string){
    return new Promise((resolve, reject) => {
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
                    recents.push({ "path": path, "datetime": new Date().toISOString() });
                }
    
                recents.sort((a: any,b: any) => { return new Date(b.datetime).getTime() - new Date(a.datetime).getTime() });
                if (recents.length > 10){
                    for(let i = recents.length-1; i > 9; i--){
                        recents.splice(i,1);
                    }
                }
            }
        
            fs.writeFile(recentsFilePath, JSON.stringify(json), (err: any) => {
                return resolve(json.recents);
            });
        });
    });
}

module.exports = {getRecentsJSON, updateRecents};