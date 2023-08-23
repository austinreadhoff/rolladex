import * as ko from "knockout";

// ---
// Usage:

// ko.components.register("dice-roller", {
//     viewModel: DiceRollerViewModel,
//     template: DiceRollerTemplate
// });

// <dice-roller></dice-roller>
// ---

export class DiceRollerViewModel {
    previousRolls = ko.observableArray<DiceRoll>();
    historyIndex = ko.observable<number>();

    rollDice(d: string, e: KeyboardEvent) {
        if (e.key == 'Enter'){
            let input = e.currentTarget as HTMLInputElement;
            if (input.value.trim() === "")
                return true;

            this.previousRolls.unshift(new DiceRoll(input.value));
            input.value = "";
            this.historyIndex(-1);
            if (this.previousRolls().length > 10)
                this.previousRolls.pop();
        }
        else if (e.key == 'ArrowUp' && this.historyIndex() < this.previousRolls().length-1){
            this.historyIndex(this.historyIndex() + 1);
            (e.currentTarget as HTMLInputElement).value = this.previousRolls()[this.historyIndex()].raw();
        }
        else if (e.key == 'ArrowDown' && this.historyIndex() > -1){
            let input = e.currentTarget as HTMLInputElement;

            this.historyIndex(this.historyIndex() - 1);
            if (this.historyIndex() == -1)
                input.value = "";
            else
                input.value = this.previousRolls()[this.historyIndex()].raw();
        }
        return true;
    }

    constructor(params: any){
        this.previousRolls = ko.observableArray([]);
        this.historyIndex = ko.observable(-1);
    }
}

export const DiceRollerTemplate: string = `
<div id="dice-container" class="container-fluid">
    <div>
        <input data-bind="event: {keydown: rollDice}" id="txt-roller" type="text" placeholder="ex: 1d12+2d4+6" autoFocus />
    </div>
    <ul data-bind="foreach: previousRolls">
        <li class="previous-roll">
            <span data-bind="text: raw" class="raw"></span>
            <br/>
            <span data-bind="text: math" class="math">6</span> = <span data-bind="text: sum" class="sum">6</span>
        </li>
    </ul>
</div>
`;

export class DiceRoll{
    raw: KnockoutObservable<string>;
    math: KnockoutObservable<string>;
    sum: KnockoutObservable<number>;

    constructor(raw: string){
        let dice = raw.split("+");
        let terms: Array<number> = [];
        let explodedTerms: Array<string> = [];

        dice.forEach(die => {
            let vals = die.split("d");
            if(vals.length === 1){
                //single addition (+4)
                explodedTerms.push(vals[0]);
                terms.push(+vals[0]);
            }
            else{
                //dice addition (+2d4)
                let term = 0;
                let subTerms = [];
                let dieCount = +vals[0];
                let dieSize = +vals[1];

                for (let i = 0; i < dieCount; i++){
                    let roll = Math.floor(Math.random() * dieSize) + 1;
                    subTerms.push(roll);
                    term += roll;
                }

                explodedTerms.push("( " + subTerms.map((x) => x.toString()).join(" + ") + " )");
                terms.push(term);
            }
        });

        this.raw = ko.observable(raw);
        this.math = ko.observable(explodedTerms.join(" + "));
        this.sum = ko.observable(terms.reduce((partialSum, x) => partialSum + x, 0));
    }
}