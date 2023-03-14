import * as ko from "knockout";

export class TuneCategory{
    name: KnockoutObservable<string>;
    tunes: KnockoutObservableArray<Tune>;

    constructor(){
        this.name = ko.observable("New Category");
        this.tunes = ko.observableArray([]);
    }
}

export class Tune{
    name: KnockoutObservable<string>;
    url: KnockoutObservable<string>;

    constructor(name: string, url: string){
        this.name = ko.observable(name);
        this.url = ko.observable(url);
    }
}