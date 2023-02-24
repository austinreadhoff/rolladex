import * as ko from "knockout";

export class Tune{
    name: KnockoutObservable<string>;
    url: KnockoutObservable<string>;

    constructor(name: string, url: string){
        this.name = ko.observable(name);
        this.url = ko.observable(url);
    }
}