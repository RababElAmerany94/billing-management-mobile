import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserProfile } from 'src/app/core/enums/user-roles.enum';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { IUser } from 'src/app/core/models/user/userModel';
import { SelectUsersComponent } from 'src/app/shared/data-selectors/select-users/select-users.component';
import { BaseUiCustomComponent } from '../base-ui-custom.component';

@Component({
    selector: 'app-select-user',
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
                [value]="selectedUser?.fullName"
                (ionFocus)="chooseUser()">
            </ion-input>
            <input type="hidden" [id]="inputName" [name]="inputName" [formControlName]="inputName" >
        </ion-item>
        <app-custom-error-display [control]="control"></app-custom-error-display>
    `
})
export class SelectUserComponent extends BaseUiCustomComponent {

    @Input()
    roles: UserProfile[];

    @Input()
    title: string;

    @Input()
    set user(value: IUser) {
        this.selectedUser = value;
        this.setUserInForm();
    }

    selectedUser: IUser;

    constructor(
        private modalController: ModalController
    ) {
        super();
    }

    chooseUser() {
        const data = {
            rolesId: this.roles,
            showAny: true,
            title: this.title
        };
        DialogHelper.openDialog(this.modalController, SelectUsersComponent, data)
            .then(result => {
                this.selectedUser = result as IUser;
                this.changeEvent.emit(this.selectedUser);
                this.setUserInForm();
            });
    }

    showEvent() {
        // TODO: Go to user information
    }

    private setUserInForm() {
        if (this.selectedUser != null) {
            this.formInstant.get(this.inputName).setValue(this.selectedUser.id);
        }
    }
}
