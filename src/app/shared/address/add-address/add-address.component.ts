import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { StringHelper } from 'src/app/core/helpers/string';
import { Address } from 'src/app/core/models/general/address.model';
import { ToastService, ToastTypes } from '../../../core/services/toast.service';
import { SelectDepartementComponent } from '../../data-selectors/select-departement/select-departement.component';

@Component({
    selector: 'app-add-address',
    templateUrl: './add-address.component.html',
    styleUrls: ['./../../../../assets/components/input.scss']
})
export class AddAddressComponent {

    /** form group of address attributes */
    form: FormGroup;

    /** the title of modal */
    title: string;

    /** show checkbox is default address */
    showIsDefault = true;

    /** selected department */
    selectedDepartment: string;

    /** address  */
    address: Address;

    constructor(
        private fb: FormBuilder,
        private translate: TranslateService,
        private toastService: ToastService,
        private navParams: NavParams,
        private modalController: ModalController
    ) {
        this.initializeForm();
        this.address = this.navParams.get('address');
        this.showIsDefault = this.navParams.get('showIsDefault');
        if (this.address != null) {
            this.setDataInForm(this.address);
        }
    }

    /** initialize form */
    initializeForm() {
        this.form = this.fb.group({
            adresse: [null, [Validators.required]],
            complementAdresse: [null],
            departement: [null],
            ville: [null, Validators.required],
            codePostal: [null],
            pays: [null],
            isDefault: [null]
        });
    }

    /** set data form */
    setDataInForm(address: Address) {
        this.form.setValue({
            adresse: address.adresse,
            complementAdresse: address.complementAdresse,
            departement: address.departement,
            ville: address.ville,
            codePostal: address.codePostal,
            pays: address.pays,
            isDefault: address.isDefault
        });
        this.selectedDepartment = address.departement;
    }

    /** save address */
    saveAddress() {
        if (this.form.valid) {
            const values = this.form.getRawValue();
            values.departement = this.selectedDepartment ? this.selectedDepartment : null;
            this.modalController.dismiss(values);
        } else {
            this.toastService.presentToast({ message: this.translate.instant('ERRORS.FILL_ALL'), type: ToastTypes.Danger });
            this.form.markAllAsTouched();
        }
    }

    /** dismiss modal controller */
    async dismiss() {
        await this.modalController.dismiss();
    }

    chooseDepartment() {
        const data = {
            countryId: null
        };
        DialogHelper.openDialog(this.modalController, SelectDepartementComponent, data).then(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.selectedDepartment = result.departementNom;
                this.form.get('departement').setValue(this.selectedDepartment);
            }
        });
    }

}
