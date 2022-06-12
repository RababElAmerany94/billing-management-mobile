import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-collabsible-form',
    templateUrl: './collabsible-form.component.html',
    styleUrls: ['./collabsible-form.component.scss'],
})
export class CollabsibleFormComponent {

    //#region inputs
    @Input()
    title: string;

    @Input()
    IconTitle: string;

    @Input()
    IconClick: string;

    @Input()
    showButtonEvent = false;

    @Input()
    showCardBody = true;
    //#endregion inputs

    //#region outputs
    @Output()
    ClickEvent = new EventEmitter();

    @Output()
    BodyEvent = new EventEmitter();
    //#endregion outputs

    constructor() { }

    //#region events

    buttonClickEvent(e: any, toggle: boolean): void {
        if (!toggle) { e.stopPropagation(); }
        this.ClickEvent.emit();
    }

    showOrHeadBody() {
        this.showCardBody = !this.showCardBody;
        this.BodyEvent.emit(this.showCardBody);
    }

    //#endregion

}
