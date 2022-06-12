import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Address, IAddressModel } from 'src/app/core/models/general/address.model';
import { AddAddressComponent } from 'src/app/shared/address/add-address/add-address.component';
import { StringHelper } from 'src/app/core/helpers/string';
import { ObjectHelper } from 'src/app/core/helpers/object';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { BaseUiCustomComponent } from '../../base-ui-custom.component';
import { ArrayHelper } from 'src/app/core/helpers/array';

@Component({
    selector: 'app-address-dropdown',
    template: `
        <ion-item  [formGroup]="formInstant" class="customInput">
            <ion-label position="floating">{{label}}</ion-label>
            <ion-select
                ngDefaultControl
                interface="popover"
                [id]="inputName"
                [formControlName]="inputName"
                (ionChange)="changeSelect($event.detail.value)">
                <ion-select-option value="">{{ 'LABELS.ANY' | translate }}</ion-select-option>
                <ion-select-option *ngFor="let item of _addresses;let i=index" [value]="i">
                    {{ buildPhraseAddress(item) }}
                </ion-select-option>
            </ion-select>
            <button *ngIf="!readOnly" class="dropdown_button" ion-button>
                <ion-icon
                    class="suffix-icon"
                    color="primary"
                    name="add"
                    slot="end"
                    (click)="addAddressDialog($event,false)">
                </ion-icon>
            </button>
        </ion-item>
        <app-custom-error-display [control]="control"></app-custom-error-display>
    `,
    styleUrls: ['../../../../../assets/components/input.scss'],
})
export class AddressDropdownComponent extends BaseUiCustomComponent {

    /** emit change selection */
    @Output()
    changeEvent = new EventEmitter<Address>();

    /** the label of form */
    @Input()
    label: string;

    /** set address format JSON */
    @Input()
    set addresses(address: Address[]) {
        if (!ArrayHelper.isEmptyOrNull(address)) {
            this._addresses = address;
        }
    }

    @Input()
    readOnly = false;

    @Input()
    set selectedAddress(value: Address) {
        if (!ObjectHelper.isNullOrUndefined(value)) {
            this.selectAddress(value);
        }
    }

    /** the list of addresses */
    _addresses: Address[] = [];

    constructor(
        public modalController: ModalController) {
        super();
    }

    /**
     * build phrase base to address object
     */
    buildPhraseAddress(address: Address) {
        return [
            address.adresse,
            address.complementAdresse,
            `${address.ville} ${address.codePostal}`,
            address.departement,
            address.pays
        ].join(', ').replace('null', '');
    }

    /**
     * change selection
     */
    changeSelect(index: number) {
        this.changeEvent.emit(this._addresses[index]);
    }

    /**
     * select address
     * @param address the address to select
     */
    selectAddress(address: Address) {
        const addressIndex = this._addresses
            .findIndex(e =>
                e.departement === address.departement &&
                e.ville === address.ville &&
                e.pays === address.pays
            );

        if (addressIndex >= 0) {
            this.setSelected(addressIndex);
        } else {
            if (address.adresse != null) {
                this._addresses.push(address);
                this.setSelected(this._addresses.length - 1);
            }
        }
    }

    /**
     * open add address dialog
     */
    async addAddressDialog(e: any, toggle: boolean) {
        if (!toggle) { e.stopPropagation(); }
        const data = {
            showIsDefault: true
        };
        DialogHelper.openDialog(this.modalController, AddAddressComponent, data).then(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                const addressModel: IAddressModel = { ...result, isNew: true };
                this._addresses.push(addressModel);
                const index = this._addresses.length - 1;
                this.changeSelect(index);
                this.setSelected(index);
            }
        });
    }

    setSelected(index: number) {// bug
        this.formInstant.get(this.inputName).setValue(index);
    }
}
