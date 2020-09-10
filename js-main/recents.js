const {app} = require('electron');
const fs = require('fs');
const { resolve } = require('path');
const { rejects } = require('assert');

var recentsFilePath = app.getPath('userData') + "/recents.json";

function getRecentsJSON(){
    return new Promise((resolve, reject) => {
        fs.readFile(recentsFilePath, 'utf-8', (error, data) => {
            if (error){
                //file doesn't exist, likely due to first time running
                var json = {"lastOpen" : null};
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

function updateLastOpen(path){
    fs.readFile(recentsFilePath, 'utf-8', (error, data) => {
        json = JSON.parse(data);
        
        json.lastOpen = path;

        fs.writeFile(recentsFilePath, JSON.stringify(json), (err) => {});
    });
}

module.exports = {getRecentsJSON, updateLastOpen};