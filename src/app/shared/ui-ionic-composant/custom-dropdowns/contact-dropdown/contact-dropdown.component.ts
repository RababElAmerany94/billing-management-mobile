import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ArrayHelper } from 'src/app/core/helpers/array';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { ObjectHelper } from 'src/app/core/helpers/object';
import { StringHelper } from 'src/app/core/helpers/string';
import { IContact, IContactModel } from 'src/app/core/models/general/contacts.model';
import { AddContactComponent } from 'src/app/shared/contacts/add-contact/add-contact.component';
import { BaseUiCustomComponent } from '../../base-ui-custom.component';

@Component({
    selector: 'kt-contact-dropdown',
    template: `
        <ion-item [formGroup]="formInstant" class="customInput">
            <ion-label position="floating">{{label}}</ion-label>
            <ion-select
                ngDefaultControl
                interface="popover"
                [id]="inputName"
                [formControlName]="inputName"
                (ionChange)="changeSelect($event.detail.value)">
                <ion-select-option value="">{{ 'LABELS.ANY' | translate }}</ion-select-option>
                <ion-select-option *ngFor="let item of _contacts;let i=index" [value]="i">
                    {{ buildPhraseContact(item)}}
                </ion-select-option>
            </ion-select>
            <button *ngIf="!readOnly" class="dropdown_button" ion-button>
                <ion-icon
                    class="suffix-icon"
                    color="primary"
                    name="add"
                    slot="end"
                    (click)="addContactDialog($event,false)">
                </ion-icon>
            </button>
        </ion-item>
        <app-custom-error-display [control]="control"></app-custom-error-display>
    `,
    styleUrls: ['../../../../../assets/components/input.scss']
})
export class ContactDropdownComponent extends BaseUiCustomComponent {

    @Input()
    label: string;

    @Input()
    set contacts(contact: IContact[]) {
        if (!ArrayHelper.isEmptyOrNull(contact)) {
            this._contacts = contact;
        }
    }

    @Input()
    set selectedContact(value: IContact) {
        if (!ObjectHelper.isNullOrUndefined(value)) {
            this.selectContact(value);
        }
    }

    @Input()
    readOnly = false;

    _contacts: IContact[] = [];

    constructor(
        public modalController: ModalController) {
        super();
    }

    /**
     * build phrase base to contact object
     */
    buildPhraseContact(contact: IContact) {
        return `${contact.civilite} ${contact.nom} ${contact.prenom}`;
    }

    /**
     * change selection
     */
    changeSelect(index: number) {
        this.changeEvent.emit(this._contacts[index]);
    }

    /**
     * open add contact dialog
     */
    async addContactDialog(e: any, toggle: boolean) {
        if (!toggle) { e.stopPropagation(); }
        const data = {
            showIsDefault: false
        };
        DialogHelper.openDialog(this.modalController, AddContactComponent, data)
            .then(result => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    const contactModel: IContactModel = result as IContactModel;
                    contactModel.isNew = true;
                    this._contacts.push(contactModel);
                    const index = this.contacts.length - 1;
                    this.changeSelect(index);
                    this.setSelected(index);
                }
            });
    }

    /**
     * select contact
     * @param contact the contact to select
     */
    selectContact(contact: IContact) {
        const contactIndex = this._contacts.findIndex(e =>
            e.nom === contact.nom &&
            e.email === contact.email &&
            e.prenom === contact.prenom &&
            e.civilite === contact.civilite);

        if (contactIndex >= 0) {
            this.setSelected(contactIndex);
        } else {
            if (contact.civilite != null) {
                this._contacts.push(contact);
                this.setSelected(this._contacts.length - 1);
            }
        }
    }

    setSelected(index: number) {
        this.formInstant.get(this.inputName).setValue(index);
    }
}
