import * as ko from "knockout";

class RecentFile {
    populated: KnockoutObservable<boolean>;
    path: KnockoutObservable<string>;

    constructor(){
        this.populated = ko.observable(false);
        this.path = ko.observable("");
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
    for (var i = 0; i < 5; i++){
        var recent: RecentFile = new RecentFile();

        if (recentsJson.length > i){
            recent.populated(true);
            recent.path(/[^/]*$/.exec(recentsJson[i].path)[0]);
        }
        else{
            recent.path("---")
        }

        viewModel.recents.push(recent);
    }
    ko.applyBindings(viewModel)
}