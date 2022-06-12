import { Component, Output, EventEmitter, Input } from '@angular/core';
import { BaseUiCustomComponent } from '../base-ui-custom.component';

@Component({
    selector: 'app-custom-input',
    templateUrl: './custom-input.component.html'
})
export class CustomInputComponent extends BaseUiCustomComponent {

    /** select event click */
    @Output()
    selectClickEvent = new EventEmitter();

    /** show event click */
    @Output()
    showClickEvent = new EventEmitter();

    /** add event click */
    @Output()
    addClickEvent = new EventEmitter();

    @Input()
    isShowMode = false;

    @Input()
    suffixIcon = false;

    @Input()
    isShowAdd = false;

    @Input()
    readOnly = false;

    constructor() {
        super();
    }

    //#region events

    selectedEvent() {
        this.selectClickEvent.emit();
    }

    /** show event */
    showEvent(e: any, toggle: boolean): void {
        if (!toggle) { e.stopPropagation(); }
        this.showClickEvent.emit();
    }

    /** show event */
    addEvent(e: any): void {
        this.addClickEvent.emit();
    }
    //#endregion

}
