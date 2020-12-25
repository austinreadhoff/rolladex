export class Spell {
    name: string;
    castingTime: string;
    classes: string[];
    components: SpellComponentProperties;
    description: string;
    duration: string;
    higherLevelDescription: string;
    level: number;
    range: string;
    ritual: boolean;
    school: string;
    source: string;
}

export class SpellComponentProperties {
    material: boolean;
    somatic: boolean;
    verbal: boolean;
    materials: string;
}

export function parseSpellJSON(json: any[]){
    let spellList: Spell[] = [];
    json.forEach(s => {
        let spell = new Spell;
        spell.name = s["name"];
        spell.castingTime = s["casting_time"];
        spell.classes = s["classes"];
        
        spell.components = new SpellComponentProperties;
        spell.components.material = s["components"]["material"] == "true" ? true: false;
        spell.components.somatic = s["components"]["somatic"] == "true" ? true: false;
        spell.components.verbal = s["components"]["verbal"] == "true" ? true: false;
        spell.components.materials = s["components"]["materials"] ? s["components"]["materials"] : "";


        spell.description = s["description"];
        spell.duration = s["duration"];
        spell.higherLevelDescription = s["higher_levels"];
        spell.level = +s["level"];
        spell.range = s["range"];
        spell.ritual = s["ritual"] == "true" ? true : false;
        spell.school = s["school"];
        spell.source = s["source"];

        spellList.push(spell);
    });

    return spellList;
}