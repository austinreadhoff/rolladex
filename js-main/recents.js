const {app} = require('electron');
const fs = require('fs');

var recentsFilePath = app.getPath('userData') + "/recents.json";

function getRecentsJSON(){
    return new Promise((resolve, reject) => {
        fs.readFile(recentsFilePath, 'utf-8', (error, data) => {
            if (error){
                //file doesn't exist, likely due to first time running
                var json = {"lastOpen" : null, "recents": []};
                fs.writeFile(recentsFilePath, JSON.stringify(json), (err) => {
                    resolve(json);
                });
            }
            else{
                resolve(JSON.parse(data));
            }
        });
    });
}

function updateRecents(path){
    return new Promise((resolve, reject) => {
        fs.readFile(recentsFilePath, 'utf-8', (error, data) => {
            json = JSON.parse(data);
            
            json.lastOpen = path;
    
            if (path){
                var recents = json.recents;
                var repeat = false;
    
                for (var i in recents){
                    if (path == recents[i].path){
                        repeat = true;
                        recents[i].datetime = new Date().toISOString();
                        break;
                    }
                }
        
                if(!repeat){
                    recents.push({ "path": path, "datetime": new Date().toISOString() });
                }
    
                recents.sort((a,b) => { return new Date(b.datetime) - new Date(a.datetime) });
                if (recents.length > 10){
                    for(var i = recents.length-1; i > 9; i--){
                        recents.splice(i,1);
                    }
                }
            }
        
            fs.writeFile(recentsFilePath, JSON.stringify(json), (err) => {
                return resolve(json.recents);
            });
        });
    });
}

module.exports = {getRecentsJSON, updateRecents};