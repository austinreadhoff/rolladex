import { spellCatalogController } from "./spells";

//Adapted and customized from https://www.w3schools.com/howto/howto_js_autocomplete.asp
export function initSpellAutoComplete(input: Node, level: number, observableName: KnockoutObservable<string>){
    var currentFocus: number;
    var levelStr = level.toString();

    var spellOptions = spellCatalogController.fullCatalog
        .filter(spell => spell.level.toString() == levelStr || levelStr == "-1")
        .map(spell => spell.name);

    /*execute a function when someone writes in the text field:*/
    input.addEventListener("input", function (this:any, e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < spellOptions.length; i++) {
            /*check if the item contains the same letters as the text field value:*/
            var matchIndex = spellOptions[i].replace(/\W/g, '').toUpperCase().indexOf(val.replace(/\W/g, '').toUpperCase())
            if (matchIndex != -1) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = spellOptions[i].substr(0, matchIndex);
                b.innerHTML += "<strong>" + spellOptions[i].substr(matchIndex, val.length) + "</strong>";
                b.innerHTML += spellOptions[i].substr(matchIndex + val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + spellOptions[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    observableName(this.getElementsByTagName("input")[0].value);

                    //This is only necessary because the spell tips shows up when you hit enter on an option, but not when you click on it.
                    let container: any = this.parentElement?.parentElement;
                    if (container){
                        var containingInput: any = Array.from(container.children).find((child: any) => child.classList.contains("spell-name"));
                    }
                    if (containingInput){
                        spellCatalogController.applyToolTip(containingInput);                  
                    }
                    
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }

        /*select the first item in the list for ease of selection*/
        if (a.childElementCount){
            currentFocus++;
            addActive(a.getElementsByTagName("div"));
        }

        if ((this.parentElement.getBoundingClientRect().y + this.parentElement.offsetHeight) + a.offsetHeight > window.innerHeight){
            a.style.top = (-a.offsetHeight).toString();
        }
    });
    /*execute a function presses a key on the keyboard:*/
    input.addEventListener("keydown", function (this:any, e: any) {
        var l = document.getElementById(this.id + "autocomplete-list");
        if (l) {
            var x = l.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    x[currentFocus].click();
                }
            } else if (e.keyCode == 27) { //esc
                closeAllLists();
            }
        }
    });
    function addActive(x: any) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        var focusedDiv: HTMLElement = x[currentFocus];
        focusedDiv.classList.add("autocomplete-active");

        /*center scrollbar on item*/
        var list = focusedDiv.parentElement;
        if (list){
            if (focusedDiv.offsetTop >= (list.scrollTop + list.offsetHeight)){
                list.scrollTop = focusedDiv.offsetTop + focusedDiv.offsetHeight - list.offsetHeight;
            }
            if (focusedDiv.offsetTop <= list.scrollTop){
                list.scrollTop = focusedDiv.offsetTop;
            }
        }
    }
    function removeActive(x: any) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt?: any) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && input != elmnt) {
                x[i].parentNode?.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}