import { triggerUnsafeSave } from "./save-tracker";

export class CharacterProperty {
    constructor(characterName: () => string, savedProperties: string[]){
        this.initProps();

        for(var p in savedProperties)
        {
            let propStr = savedProperties[p];
            let propName = propStr as Extract<keyof this, string>;
            if(this.hasOwnProperty(propStr)) {
                (this[propName] as any).extend({notify: "always"});
                (this[propName] as any).subscribe(function(){triggerUnsafeSave(characterName());});
            }
        }
    }

    protected initProps(): void {}
}