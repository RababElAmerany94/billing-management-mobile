import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-base-ui-composants',
    template: '',
    styleUrls: ['../../../assets/components/input.scss']
})
export class BaseUiCustomComponent implements OnInit {

    @Input() placeholder: string;
    @Input() label: string;
    @Input() inputName: string;
    @Input() formInstant: FormGroup;
    @Input() iconName: string;
    @Input() type = 'text';
    @Input() customInput = 'customInput';
    @Output() changeEvent = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    get control() {
        return this.formInstant.controls[this.inputName];
    }

    /**
     * Emit input event to parent
     */
    input(event) {
        this.changeEvent.emit(event);
    }

}
