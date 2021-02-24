export var jsonSchemaVersion = 0.1;

export function UpgradeSchema(json: any){
    switch (json["version"]){
        case 0.1:
            json = ConvertProficiency(json);
    }

    return json;
}

function ConvertProficiency(json: any){
    json["version"] = 0.2;
    return json;
}