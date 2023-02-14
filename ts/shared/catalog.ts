//Contains miscellaneous helper classes and functions that are shared between catalog code

export class CatalogController<T> { 
    fullCatalog: T[];
    baseElement: HTMLElement;
    loadData: Function;
    filterCatalog: Function;
    applyToolTip: (el: HTMLInputElement) => void;
}

export class CatalogObject {
    capitalize(str: string){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

export class CatalogTraits {
    custom: string; //Can this be removed?
    rarity: string;
    value: string[];
}

export function getJSON(path: string){
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open('GET', path, true);
    
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                resolve(JSON.parse(request.responseText));
            }
        };
    
        request.send();
    });
}

export function setupFilterToggle(toggleEl: HTMLElement, filterUl: HTMLElement){
    toggleEl.addEventListener('click', event => {
        if (filterUl.hidden) {
            filterUl.hidden = false;
            toggleEl.querySelector(".filter-toggle-icon").classList.add("down");
        } else {
            filterUl.hidden = true;
            toggleEl.querySelector(".filter-toggle-icon").classList.remove("down");
        }
    })
}

//Dynamically creates a list of filter checkboxes from the options available in the given data
//catalog: the full array of data
//filterElId: where the filters go
//property: the property on type T that is being filtered by
//uniqueString: differentiates control and label IDs from others in the same sheet
//filterCallback: the function that performs the filtering on the dataset, to be called when filters change
//zeroCantrip: values of "0" should be replaced with the string "cantrip"
export function populateFilterDropDown<T>(catalog: T[], filterEl: HTMLElement, property: string, uniqueString: string, filterCallback: Function, zeroCantrip: boolean = false){
    var options: any[] = [];

    catalog.forEach(obj => {
        if(Array.isArray(obj[property as keyof T])){
            let arr = obj[property as keyof T] as unknown as string[];
            arr.forEach((x: string) => {
                if (options.indexOf(x.toUpperCase()) == -1){
                    options.push(x.toUpperCase());
                }
            });
        }
        else{
            let str = obj[property as keyof T]
            if (options.indexOf(str) == -1){
                options.push(str);
            }
        }
    });

    options.sort(); //handles strings
    options.sort((a,b) => { return a-b });  //handles numbers without 1, 10, 2...

    options.forEach(option => {
        var el = document.createElement("li");
        let inputID = `${uniqueString}-${property}-filter-${option.toString().replace(/[^a-zA-Z0-9]*/g, "")}`;
        el.classList.add("form-check");
        el.innerHTML = 
        `<input class="rpgui-checkbox catalog-filter ${property}-filter" type="checkbox" id="${inputID}" data-filterval="${option}">
        <label class="form-check-label" for="${inputID}">${option == "0" && zeroCantrip ? "cantrip" : option.toString().toLowerCase()}</label>`

        filterEl.appendChild(el);
        filterEl.querySelector("#"+inputID).addEventListener('input', event =>{
            filterCallback();
        });
    });
}