import { Component, Input } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ClientType } from 'src/app/core/enums/client-type.enum';
import { ModeEnum } from 'src/app/core/enums/mode.enum';
import { RouteName } from 'src/app/core/enums/route.enum';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { StringHelper } from 'src/app/core/helpers/string';
import { IClient } from 'src/app/pages/clients/client.model';
import { SelectClientsComponent } from '../../data-selectors/select-clients/select-clients.component';
import { BaseUiCustomComponent } from '../base-ui-custom.component';

@Component({
    selector: 'app-select-client',
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
                [value]="selectedClient?.fullName"
                (ionFocus)="chooseClient()">
            </ion-input>
            <input type="hidden" [id]="inputName" [name]="inputName" [formControlName]="inputName" >
            <ion-icon
                class="suffix-icon"
                color="primary"
                name="eye-outline"
                slot="end"
                (click)="showEvent()">
            </ion-icon>
        </ion-item>
        <app-custom-error-display [control]="control"></app-custom-error-display>
    `
})
export class SelectClientComponent extends BaseUiCustomComponent {

    @Input()
    types: ClientType[] = [ClientType.Particulier, ClientType.Professionnel];

    @Input()
    set client(value: IClient) {
        this.selectedClient = value;
        this.setUserInForm();
    }

    selectedClient: IClient;

    constructor(
        private modalController: ModalController,
        private router: Router
    ) {
        super();
    }

    chooseClient() {
        if (!this.formInstant.disabled) {
            const data = {
                types: this.types,
            };
            DialogHelper.openDialog(this.modalController, SelectClientsComponent, data).then(result => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    this.selectedClient = result;
                    this.changeEvent.emit(this.selectedClient);
                    this.setUserInForm();
                }
            });
        }
    }

    showEvent() {
        if (this.selectedClient != null) {
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    mode: ModeEnum.Show,
                    id: this.selectedClient != null ? this.selectedClient.id : null,
                    isNavigationRoute: true
                }
            };
            this.router.navigate([`/${RouteName.Clients}`], navigationExtras);
        }
    }

    private setUserInForm() {
        if (this.selectedClient != null) {
            this.formInstant.get(this.inputName).setValue(this.selectedClient.id);
        }
    }
}
