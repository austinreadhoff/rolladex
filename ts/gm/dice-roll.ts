import * as ko from "knockout";

export class DiceRoll{
    raw: KnockoutObservable<string>;
    math: KnockoutObservable<string>;
    sum: KnockoutObservable<number>;

    constructor(raw: string){
        let dice = raw.split("+");
        let terms: Array<number> = [];

        dice.forEach(die => {
            let vals = die.split("d");
            if(vals.length === 1){
                //single addition (+4)
                terms.push(+vals[0])
            }
            else{
                //dice addition (+2d4)
                let term = 0;
                let dieCount = +vals[0];
                let dieSize = +vals[1];

                for (let i = 0; i < dieCount; i++){
                    term += Math.floor(Math.random() * dieSize) + 1;
                }

                terms.push(term);
            }
        });

        this.raw = ko.observable(raw);
        this.math = ko.observable(terms.map((x) => x.toString()).join(" + "));
        this.sum = ko.observable(terms.reduce((partialSum, x) => partialSum + x, 0));
    }
}