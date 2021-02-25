declare global{
    interface Element{
        SetupSkillbox(onChange: Function): void;
        UpdateSkillbox(): void;
    }
}

//Execute on a div exactly once
if (!Element.prototype.hasOwnProperty('SetupSkillbox')){
    Element.prototype.SetupSkillbox = function(onChange: Function): void{
        this.classList.add("skillbox");

        this.addEventListener("click", event => {
            if (this.classList.contains("skillbox-null")){
                this.classList.remove("skillbox-null");
                this.classList.add("skillbox-proficient");
                this.innerHTML = "P";
            }
            else if (this.classList.contains("skillbox-proficient")){
                this.classList.remove("skillbox-proficient");
                this.classList.add("skillbox-expertise");
                this.innerHTML = "E";
            }
            else if (this.classList.contains("skillbox-expertise")){
                this.classList.remove("skillbox-expertise");
                this.classList.add("skillbox-null");
                this.innerHTML = "&nbsp";
            }

            onChange();
        }, true);
    }
}

//Execute when the value is updated
if (!Element.prototype.hasOwnProperty('UpdateSkillbox')){
    Element.prototype.UpdateSkillbox = function(): void{
        switch(this.innerHTML){
            case "P":
                this.className = "skillbox skillbox-proficient";
                break;
            case "E":
                this.className = "skillbox skillbox-expertise";
                break;
            case "&nbsp":
            default:
                this.innerHTML = "&nbsp";
                this.className = "skillbox skillbox-null";
                break;
        }
    }
}

export {};