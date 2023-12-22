import * as ko from "knockout";

class RecentFile {
    populated: KnockoutObservable<boolean>;
    name: KnockoutObservable<string>;
    path: KnockoutObservable<string>;

    constructor(){
        this.populated = ko.observable(false);
        this.name = ko.observable("---");
        this.path = ko.observable("---");
    }
}

export class ViewModel {
    recents: KnockoutObservableArray<RecentFile>;

    constructor(){
        this.recents = ko.observableArray([]);
    }
}

export var viewModel = new ViewModel();

export function applyDataBinding(recentsJson: any){
    for (let i = 0; i < 5; i++){
        let recent: RecentFile = new RecentFile();

        if (recentsJson.length > i){
            let json = recentsJson[i];
            recent.populated(true);
            recent.path(/[^/]*$/.exec(json.path)[0]);

            if (json.hasOwnProperty("name")){    //backwards compatibility < 0.3.3
                recent.name(json.name);
            }
        }

        viewModel.recents.push(recent);
    }
    ko.applyBindings(viewModel)
}