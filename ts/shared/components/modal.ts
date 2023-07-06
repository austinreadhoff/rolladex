import * as ko from "knockout";

// ---
// Usage:

// ko.components.register("modal", {
//     viewModel: ModalViewModel,
//     template: ModalTemplate
// });

// <modal params="name: 'info-popup'">
//  <something>...Modal contents go here...</something>
// </modal>

// modal element ID will be set to the given name
// ---

export class ModalViewModel {
    name = ko.observable<string>();

    constructor(params: any){
        this.name = params.name;
    }
}

export const ModalTemplate: string = `
<div class="modal" data-bind="attr: {id: name}" >
    <div class="modal-content rpgui-container framed-golden container" 
        style="position: fixed; z-index: 99; margin:auto; display: flex; flex-direction: column;
        left:0;right:0;top:0;bottom:0;
        width:fit-content;height:fit-content; max-width: 50%; max-height: 50%">

        <div class="row">
            <div class="col-10"></div>
            <div class="col-2 modal-x" style="color:gold"
                data-bind="click: function(data, e){ document.getElementById(data.name).hidden = true; }">X</div>
        </div>
        <hr style="width:100%"></hr>
        <div style="overflow-y: scroll;">
            <!-- ko template: { nodes: $componentTemplateNodes } --><!-- /ko -->
        </div>
    </div>
</div>
`;