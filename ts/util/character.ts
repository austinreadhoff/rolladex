import * as ko from "knockout";

export class Character {
    version: KnockoutObservable<number>;
    characterName: KnockoutObservable<string>;
    classLevel: KnockoutObservable<string>;
    background: KnockoutObservable<string>;
    playerName: KnockoutObservable<string>;
    race: KnockoutObservable<string>;
    alignment: KnockoutObservable<string>;
    xp: KnockoutObservable<string>;
    str: KnockoutObservable<string>;
    dex: KnockoutObservable<string>;
    con: KnockoutObservable<string>;
    int: KnockoutObservable<string>;
    wis: KnockoutObservable<string>;
    char: KnockoutObservable<string>;
    inspiration: KnockoutObservable<boolean>;
    proficiency: KnockoutObservable<string>;
    joat: KnockoutObservable<boolean>;
    savingStr: KnockoutObservable<boolean>;
    savingDex: KnockoutObservable<boolean>;
    savingCon: KnockoutObservable<boolean>;
    savingInt: KnockoutObservable<boolean>;
    savingWis: KnockoutObservable<boolean>;
    savingChar: KnockoutObservable<boolean>;
    armorClass: KnockoutObservable<string>;
    speed: KnockoutObservable<string>;
    currentHP: KnockoutObservable<string>;
    maxHP: KnockoutObservable<string>;
    tempHP: KnockoutObservable<string>;
    currentHitDice: KnockoutObservable<string>;
    maxHitDice: KnockoutObservable<string>;
    deathSavingSuccess1: KnockoutObservable<boolean>;
    deathSavingSuccess2: KnockoutObservable<boolean>;
    deathSavingSuccess3: KnockoutObservable<boolean>;
    deathSavingFailure1: KnockoutObservable<boolean>;
    deathSavingFailure2: KnockoutObservable<boolean>;
    deathSavingFailure3: KnockoutObservable<boolean>;
    copper: KnockoutObservable<string>;
    silver: KnockoutObservable<string>;
    electrum: KnockoutObservable<string>;
    gold: KnockoutObservable<string>;
    platinum: KnockoutObservable<string>;
    age: KnockoutObservable<string>;
    height: KnockoutObservable<string>;
    weight: KnockoutObservable<string>;
    eyes: KnockoutObservable<string>;
    skin: KnockoutObservable<string>;
    hair: KnockoutObservable<string>;
    spellcastingClass: KnockoutObservable<string>;
    spellcastingAbility: KnockoutObservable<string>;
    spellSaveDC: KnockoutObservable<string>;
    spellAttackBonus: KnockoutObservable<string>;
    proficienciesLanguages: KnockoutObservable<string>;
    equipment: KnockoutObservable<string>;
    features: KnockoutObservable<string>;
    physicalDescription: KnockoutObservable<string>;
    traits: KnockoutObservable<string>;
    ideals: KnockoutObservable<string>;
    bonds: KnockoutObservable<string>;
    flaws: KnockoutObservable<string>;
    backstory: KnockoutObservable<string>;
    allies: KnockoutObservable<string>;
    additionalFeatures: KnockoutObservable<string>;
    treasure: KnockoutObservable<string>;
    acrobatics: KnockoutObservable<string>;
    animalHandling: KnockoutObservable<string>;
    arcana: KnockoutObservable<string>;
    athletics: KnockoutObservable<string>;
    deception: KnockoutObservable<string>;
    history: KnockoutObservable<string>;
    insight: KnockoutObservable<string>;
    intimidation: KnockoutObservable<string>;
    medicine: KnockoutObservable<string>;
    nature: KnockoutObservable<string>;
    perception: KnockoutObservable<string>;
    performance: KnockoutObservable<string>;
    persuasion: KnockoutObservable<string>;
    religion: KnockoutObservable<string>;
    slightOfHand: KnockoutObservable<string>;
    stealth: KnockoutObservable<string>;
    survival: KnockoutObservable<string>;
    attackStats: KnockoutObservableArray<Attack>;
    miscCounters: KnockoutObservableArray<Counter>;
    spellRest: KnockoutObservable<string>;
    spells: KnockoutObservableArray<SpellLevel>;

    constructor(json?: any){
        if(json === undefined){
            
        }
        else{
            
        }
    }
}

class Attack {
    name: KnockoutObservable<string>;
    bonus: KnockoutObservable<string>;
    dmg: KnockoutObservable<string>;
}

class Counter {
    name: KnockoutObservable<string>;
    current: KnockoutObservable<string>;
    max: KnockoutObservable<string>;
    shortRest: KnockoutObservable<boolean>;
    longRest: KnockoutObservable<boolean>;
}

class SpellLevel {
    level: KnockoutObservable<number>;
    slotsRemaining: KnockoutObservable<string>;
    slotsTotal: KnockoutObservable<string>;
    spells: KnockoutObservableArray<CharacterSpell>;
}

class CharacterSpell {
    name: KnockoutObservable<string>;
    prepared: KnockoutObservable<boolean>;
}