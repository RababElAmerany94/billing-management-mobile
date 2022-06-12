import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ModeEnum } from 'src/app/core/enums/mode.enum';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AddAddressComponent } from './add-address/add-address.component';
import { Address } from 'src/app/core/models/general/address.model';
import { Departement } from 'src/app/core/models/general/departement.model';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { StringHelper } from 'src/app/core/helpers/string';

@Component({
    selector: 'app-address',
    templateUrl: './address.component.html',
    styleUrls: ['./../../../assets/components/card-content.scss']
})
export class AddressComponent {

    @Output()
    changeAddress = new EventEmitter<Address[]>();

    @Input()
    addresses: Address[] = [];

    @Input()
    mode: ModeEnum;

    modes: typeof ModeEnum = ModeEnum;

    constructor(
        public modalController: ModalController,
        public translate: TranslateService,
        public alertController: AlertController
    ) { }

    /** add address dialog  */
    async addAddressDialog(i: number) {
        const data = {
            address: i !== -1 ? this.addresses[i] : null,
            showIsDefault: true
        };
        DialogHelper.openDialog(this.modalController, AddAddressComponent, data).then(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                if (result.isDefault) { this.updateIsDefaultAddress(); }
                if (this.addresses.length === 0) { result.isdefault = true; }
                (i === -1) ? this.addresses.push(result) : this.addresses[i] = result;
                this.emitChange();

            }
        });
    }

    /** delete Address */
    deleteAddress(i: number) {
        const adresse = this.addresses[i];
        DialogHelper.presentAlert(
            this.alertController,
            this.translate,
            {
                headerText: this.translate.instant('ADDRESS.DELETE.HEADER_TEXT'),
                message: this.translate.instant('ADDRESS.DELETE.QUESTION') + ' : ' + adresse.adresse.toUpperCase() + ' ? ',
                done: async () => {
                    this.addresses.splice(i, 1);
                    this.emitChange();
                },
                cancel: () => {
                }
            }
        );
    }

    /** when we set an address as default we need to update another to be not default address */
    updateIsDefaultAddress() {
        if (this.addresses !== undefined || this.addresses !== null) {
            this.addresses.map(e => e.isDefault = false);
        }
    }

    /** emit changes */
    emitChange() {
        this.changeAddress.emit(this.addresses);
    }

    // is show mode
    isShowMode = () => this.mode === ModeEnum.Show;

    /** convert to departement model */
    parseDep(departement: any): Departement {
        return departement;
    }
}
