import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { StringHelper } from 'src/app/core/helpers/string';
import { IAgence } from 'src/app/core/models/agence/agence.model';
import { SelectAgencesComponent } from '../../data-selectors/select-agences/select-agences.component';
import { BaseUiCustomComponent } from '../base-ui-custom.component';

@Component({
    selector: 'app-select-agence',
    template: `
        <ion-item no-padding class="{{customInput}}" [formGroup]="formInstant">
            <ion-label position="floating">
                <ng-container *ngIf="iconName">
                    <ion-icon
                        [name]="iconName"
                        item-start>
                    </ion-icon>
                </ng-container>
                {{label}}
            </ion-label>
            <ion-input
                [disabled]="formInstant.disabled"
                [value]="selectedAgence?.raisonSociale"
                (ionFocus)="chooseAgence()">
            </ion-input>
            <input type="hidden" [id]="inputName" [name]="inputName" [formControlName]="inputName" >
        </ion-item>
        <app-custom-error-display [control]="control"></app-custom-error-display>
    `
})
export class SelectAgenceComponent extends BaseUiCustomComponent {

    @Input()
    set agence(value: IAgence) {
        this.selectedAgence = value;
        this.setAgenceInForm();
    }

    selectedAgence: IAgence;

    constructor(
        private modalController: ModalController
    ) {
        super();
    }

    chooseAgence() {
        DialogHelper.openDialog(this.modalController, SelectAgencesComponent, null).then(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.selectedAgence = result;
                this.changeEvent.emit(this.selectedAgence);
                this.setAgenceInForm();
            }
        });
    }

    private setAgenceInForm() {
        if (this.selectedAgence != null) {
            this.formInstant.get(this.inputName).setValue(this.selectedAgence.id);
        }
    }
}
