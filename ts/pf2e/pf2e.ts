document.addEventListener("DOMContentLoaded", function(){
    document.querySelectorAll('.nav-link').forEach(tab => {
        tab.addEventListener('click', event => {
            switchTab(tab.id.substring(0, tab.id.indexOf("-tab")));
        });
    });
});


//#region Menu Actions

export function switchTab(tabId: string){
    document.querySelectorAll('.nav-link').forEach(t => { t.classList.remove("active"); });
    document.getElementById(tabId + "-tab").classList.add("active");
    
    document.querySelectorAll('.tab-pane').forEach(t => { t.className = "tab-pane"; });
    document.querySelector("#" + tabId).className = "tab-pane show active";

    document.body.scrollTop = 0;
}

//#endregion