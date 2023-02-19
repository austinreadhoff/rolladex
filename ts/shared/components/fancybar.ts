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

    boundValue = () => {
        let current: number;
        let max: number;

        if (this.currentValue().indexOf('d') > -1){
            current = +this.currentValue().substring(0, this.currentValue().indexOf('d'));
            max = +this.maxValue().substring(0, this.maxValue().indexOf('d'));
        }
        else{
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

    //assumes current value is already a number, or xdx format
    adjust(amt: number){
        let current: number;
        let max: number;
        let isDFormat: boolean = this.currentValue().indexOf('d') > -1;

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
    }
}

export const FancyBarTemplate: string = `
<div class="fancy-bar-inputs">
    <input data-bind="textInput: currentValue"/>/
    <input data-bind="textInput: maxValue"/>
</div>
<div class="rpgui-progress">
    <div class="rpgui-progress-track">
        <div data-bind="class: color, style: { width: boundValue() }" class=" rpgui-progress-fill" style="left: 0px;"></div>
    </div>
    <div class=" rpgui-progress-left-edge"></div>
    <div class=" rpgui-progress-right-edge"></div>
    <button data-bind="click: adjust(-1)" type="button" class="rpgui-button fancy-minus btn-small">-</button>
    <button data-bind="click: adjust(1)" type="button" class="rpgui-button fancy-plus btn-small">+</button>
</div>
`;