
import { Component, Input, OnInit } from '@angular/core';
import { IDropDownItem } from 'src/app/core/models/general/drop-down-item.model';
import { BaseUiCustomComponent } from '../../base-ui-custom.component';

@Component({
    selector: 'app-custom-drop-down',
    template: `
        <ng-container *ngIf="loaded">
            <ion-item [formGroup]="formInstant" class="{{customInput}}">
            <ion-label>{{label}}</ion-label>
            <ion-select
                [id]="inputName"
                [formControlName]="inputName"
                interface="popover"
                (ionChange)="onSelectionChangedChanged($event.detail.value)">
                <ion-select-option *ngIf="showAny" value="">{{ 'LABELS.ANY' | translate }}</ion-select-option>
                <ion-select-option *ngFor="let item of dropDownItems" [value]="item.value">
                    {{ item.text | translate }}
                </ion-select-option>
            </ion-select>
            </ion-item>
            <app-custom-error-display [control]="control"></app-custom-error-display>
        <ng-container>
    `
})
export class CustomDropDownComponent<TValue, TText> extends BaseUiCustomComponent implements OnInit {

    @Input()
    label: string;

    @Input()
    set data(val: IDropDownItem<TValue, TText>[]) {
        if (val !== null) {
            this.dropDownItems = val;
            this.loaded = true;
        }
    }

    @Input()
    showAny = true;

    loaded = false;

    dropDownItems: IDropDownItem<TValue, TText>[] = [];

    constructor() {
        super();
    }

    onSelectionChangedChanged(event: any) {
        this.changeEvent.emit(event);
    }

}
