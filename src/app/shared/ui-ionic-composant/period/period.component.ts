import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseUiCustomComponent } from '../base-ui-custom.component';

@Component({
    selector: 'app-period',
    templateUrl: './period.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PeriodComponent),
            multi: true
        }
    ]
})
export class PeriodComponent extends BaseUiCustomComponent implements OnInit {

    periods: string[] = [];

    @Input()
    value: string;

    constructor(
    ) {
        super();
    }

    ngOnInit() {
        this.periods = this.getPeriods();
    }

    // this is the initial value set to the component
    public writeValue(obj: any) {
        if (obj) {
            this.value = obj;
        } else {
            this.value = null;
        }
    }

    // registers 'fn' that will be fired when changes are made
    // this is how we emit the changes back to the form
    public registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    // not used, used for touch input
    public registerOnTouched() { }

    // change events from the textarea
    onChange(event) {
        const newValue = event;
        this.value = newValue;

        // update the form
        this.propagateChange(this.value);
    }

    // the method set in registerOnChange to emit changes back to the form
    private propagateChange = (_: any) => { };

    /**
     * get list of periods
     */
    getPeriods() {

        // init params
        const periods: string[] = [];
        const length = 8;

        // loops for fill
        for (let index = 0; index <= length; index++) {
            if (index !== 0) {
                periods.push(`0${index}:00`);
            }
            if (index !== length) {
                periods.push(`0${index}:30`);
            }
        }

        return periods;
    }
}
