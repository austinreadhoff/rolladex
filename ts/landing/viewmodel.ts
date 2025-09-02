import { ipcRenderer } from "electron";
import * as ko from "knockout";
import { IPCMessage } from "../shared/ipc-message";

class RecentFile {
    populated: KnockoutObservable<boolean>;
    name: KnockoutObservable<string>;
    path: KnockoutObservable<string>;
    shortPath: KnockoutObservable<string>;

    constructor(){
        this.populated = ko.observable(false);
        this.name = ko.observable("---");
        this.path = ko.observable("");
        this.shortPath = ko.observable("---");
    }

    load(){
        if (this.path().trim() !== '')
            ipcRenderer.send(IPCMessage.LoadRecent, this.path());
    }
}

export class ViewModel {
    recents: KnockoutObservableArray<RecentFile>;

    constructor(){
        this.recents = ko.observableArray([]);
    }

    clearRecents(): void{
        this.recents([
            new RecentFile(),
            new RecentFile(),
            new RecentFile(),
            new RecentFile(),
            new RecentFile(),
        ]);
    }
}

export var viewModel = new ViewModel();

export function applyDataBinding(recentsJson: any){
    for (let i = 0; i < 5; i++){
        let recent: RecentFile = new RecentFile();

        if (recentsJson.length > i){
            let json = recentsJson[i];
            recent.populated(true);
            recent.path(json.path);
            recent.shortPath(/[^/]*$/.exec(json.path)[0]);

            if (json.hasOwnProperty("name")){    //backwards compatibility < 0.3.3
                recent.name(json.name);
            }
        }

        viewModel.recents.push(recent);
    }
    ko.applyBindings(viewModel)
}