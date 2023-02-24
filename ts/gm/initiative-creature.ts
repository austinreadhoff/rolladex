import * as ko from "knockout";

export class InitiativeCreature{
    name: KnockoutObservable<string>;
    initiative: KnockoutObservable<number>;
    currentHP: KnockoutObservable<string>;
    maxHP: KnockoutObservable<string>;

    constructor(){
        this.name = ko.observable("");
        this.initiative = ko.observable(0);
        this.currentHP = ko.observable("");
        this.maxHP = ko.observable("");
    }
}