import * as ko from "knockout";

// ---
// Usage:

// ko.components.register("fancy-bar", {
//     viewModel: FancyBarViewModel,
//     template: FancyBarTemplate
// });

// <fancy-bar params="currentValue: currentHP, maxValue: maxHP, color: 'red'"></fancy-bar>
// ---

export class FancyBarViewModel {
    currentValue = ko.observable<string>();
    maxValue = ko.observable<string>();
    color = ko.observable<string>(); //red, green, blue, or null (purple)

    //holds value while doing math
    private tempValue: string;

    storeTempValue = () => {
        this.tempValue = this.currentValue();
    }
    checkForMath = () => {
        if (this.currentValue().indexOf('+') == 0){
            let adjustment = +this.currentValue().substring(1);
            this.currentValue(this.tempValue);
            this.adjust(adjustment);
            return;
        }
        else if (this.currentValue().indexOf('-') == 0){
            let adjustment = +this.currentValue().substring(1);
            this.currentValue(this.tempValue);
            this.adjust(-adjustment);
            return;
        }
    }
    checkForEnter = (data: any, event: KeyboardEvent) => {
        if (event.key == "Enter"){
            (event.target as HTMLInputElement).blur();
            return false;
        }
        return true;
    }

    boundValue = () => {
        let current: number;
        let max: number;

        if (this.currentValue().indexOf('+') == 0 || this.currentValue().indexOf('-') == 0){
            //don't change the bar while typing math
            //this works because for some reason NaN causes the css to remain unchanged
            //easier than handling both numbers and dice using tempValue
            return NaN;
        }

        if (this.currentValue().indexOf('d') > -1){
            //Multiple types of dice: xda,ydb
            if (this.currentValue().indexOf(',') > -1){
                current = 0;
                max = 0;

                this.currentValue()
                    .split(',')
                    .map(d => current += +d.substring(0, this.currentValue().indexOf('d')));

                this.maxValue()
                    .split(',')
                    .map(d => max += +d.substring(0, this.maxValue().indexOf('d')));
            }
            //Single dice: xda
            else{
                current = +this.currentValue().substring(0, this.currentValue().indexOf('d'));
                max = +this.maxValue().substring(0, this.maxValue().indexOf('d'));
            }
        }
        else{
            //Just numbers
            current = +this.currentValue();
            max = +this.maxValue();
        }

        if (current <= 0 || max <= 0)
            return "0%";

        if (isNaN(current) || isNaN(max))
            return "0%";

        let percent = current / max * 100;
        if (percent > 100)
            return "100%";
        else
            return percent + "%";
    }

    //assumes current value is already a number, or in dice format
    adjust(amt: number){
        let current: number;
        let max: number;
        let isDFormat: boolean = this.currentValue().indexOf('d') > -1;
        let isMultiD: boolean = this.currentValue().indexOf(',') > -1 && isDFormat;

        if (isMultiD){
            let dIndex: number;
            let currentValues = this.currentValue()
                .split(',')
                .map(d => +d.substring(0, this.currentValue().indexOf('d')));

            let maxValues = this.maxValue()
                .split(',')
                .map(d => +d.substring(0, this.maxValue().indexOf('d')));

            if (amt > 0){
                dIndex = currentValues.findIndex((v, i) => v + amt <= maxValues[i]);
            }
            else{
                dIndex = currentValues.findIndex(v => v + amt >= 0);
            }

            if (dIndex > -1){
                let dice = this.currentValue().split(',');
                current = +(dice[dIndex].substring(0,this.currentValue().indexOf('d')));
                let suffix = dice[dIndex].substring(this.currentValue().indexOf('d'));
                dice[dIndex] = ((current + amt).toString() + suffix);
                this.currentValue(dice.join(','));
            }

            return;
        }

        if (isDFormat){
            current = +this.currentValue().substring(0, this.currentValue().indexOf('d'));
            max = +this.maxValue().substring(0, this.maxValue().indexOf('d'));
        }
        else{
            current = +this.currentValue();
            max = +this.maxValue();
        }

        let newValue = current + amt;

        if (newValue < 0)
            newValue = 0;

        if (newValue > max)
            newValue = max;

        if (isDFormat){
            let suffix = this.currentValue().substring(this.currentValue().indexOf('d'));
            this.currentValue(newValue.toString() + suffix);
        }
        else{
            this.currentValue(newValue.toString())
        }
    }

    constructor(params: any){
        this.currentValue = params.currentValue;
        this.maxValue = params.maxValue;
        this.color = params.color;

        this.tempValue = "0";
    }
}

export const FancyBarTemplate: string = `
<div class="fancy-bar-inputs">
    <input data-bind="textInput: currentValue, event: { focus: storeTempValue, blur: checkForMath, keypress: checkForEnter }"/>/
    <input data-bind="textInput: maxValue"/>
</div>
<div class="rpgui-progress">
    <div class="rpgui-progress-track">
        <div data-bind="class: color, style: { width: boundValue() }" class=" rpgui-progress-fill" style="left: 0px;"></div>
    </div>
    <div class=" rpgui-progress-left-edge"></div>
    <div class=" rpgui-progress-right-edge"></div>
    <button data-bind="click: function(){adjust(-1)}" type="button" class="rpgui-button fancy-minus btn-small">-</button>
    <button data-bind="click: function(){adjust(1)}" type="button" class="rpgui-button fancy-plus btn-small">+</button>
</div>
`;