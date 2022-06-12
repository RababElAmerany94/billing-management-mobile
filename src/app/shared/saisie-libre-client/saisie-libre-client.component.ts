import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ClientType } from 'src/app/core/enums/client-type.enum';
import { NumerationType } from 'src/app/core/enums/numerotation.enum';
import { ResultStatus } from 'src/app/core/enums/result-status';
import { ConversionHelper } from 'src/app/core/helpers/conversion';
import { StringHelper } from 'src/app/core/helpers/string';
import { Address } from 'src/app/core/models/general/address.model';
import { IContact } from 'src/app/core/models/general/contacts.model';
import { IDropDownItem } from 'src/app/core/models/general/drop-down-item.model';
import { NumerotationService } from 'src/app/core/services/numerotation-service/numerotation.service';
import { ClientShared } from 'src/app/pages/clients/client-shared';
import { BaseEditComponent } from 'src/app/shared/base-features/base-edit.component';
import { GenreClient } from '../../core/enums/genre-client.enum';
import { ToastService, ToastTypes } from '../../core/services/toast.service';
import { IClientModel } from '../../pages/clients/client.model';

@Component({
    selector: 'app-saisie-libre-client',
    templateUrl: './saisie-libre-client.component.html',
    styleUrls: ['../../../assets/components/input.scss',
        '../../../assets/components/grid.scss'],
})
export class SaisieLibreClientComponent extends BaseEditComponent<IClientModel> {

    /** list addresses */
    address: Address[] = [];

    /** list contacts */
    contacts: IContact[] = [];

    /** client type dropdown */
    clientType: IDropDownItem<number, string>[] = [];

    /** genre client dropdown */
    genreClient: IDropDownItem<number, string>[] = [];

    /** type of client */
    types: ClientType[] = [];

    constructor(
        private modalController: ModalController,
        private numerationService: NumerotationService,
        private toastService: ToastService,
        private translate: TranslateService,
        private navParams: NavParams,
        private fb: FormBuilder) {
        super();
        this.types = this.navParams.get('types');
        this.initForm();
        this.chargeDropDownClientType();
        this.chargeDropDownGenreClient();
    }
    //#region form

    /**
     * init client form
     */
    initForm() {
        this.form = ClientShared.createForm(this.fb);
    }

    //#endregion

    //#region services

    /**
     * generate les champs a un client
     */
    generateChampsClient() {
        let type: NumerationType;

        if (this.isClientProfessionnel()) {
            type = NumerationType.CLIENT_PROFESSIONNEL;
        } else if (this.isClientParticulier()) {
            type = NumerationType.CLIENT_PARTICULIER;
        } else if (this.form.get('type').value === 'Obliges' || this.isClientOblige()) {
            type = NumerationType.CLIENT_OBLIGES;
        }

        if (type != null) {
            this.numerationService
                .GenerateNumerotation(type)
                .subscribe(item => {
                    if (item.status === ResultStatus.Succeed) {
                        this.form.get('reference').setValue(item.value);
                    }
                });
        } else {
            this.form.get('reference').setValue('');
        }
    }
    //#endregion

    //#region save data

    /**
     * build client object
     */
    buildClientObject(): IClientModel {
        const clientModel: IClientModel = { ...this.form.getRawValue() };
        clientModel.addresses = this.address;
        clientModel.contacts = this.contacts;
        return clientModel;
    }

    /**
     * save client
     */
    save() {
        if (this.form.get('type').value === 'Obliges') {
            this.form.get('genre').setValue(GenreClient.Client);
            this.form.get('type').setValue(ClientType.Obliges);
        }
        if (this.form.valid) {
            this.modalController.dismiss(this.buildClientObject());
        } else {
            this.toastService.presentToast({ message: this.translate.instant('ERRORS.FILL_ALL'), type: ToastTypes.Danger });
            this.form.markAllAsTouched();
        }
    }

    //#endregion

    //#region helper

    /**
     * set addresses
     */
    setAddress(address: Address[]) {
        if (address) {
            this.address = address;
        }
    }
    /**
     * set contacts
     */
    setContact(contact: IContact[]) {
        this.contacts = contact;
    }

    /**
     * generate coode comptable
     */
    generateCodeComptable() {
        this.form.get('codeComptable').setValue(
            (StringHelper.isEmptyOrNull(this.form.controls.firstName.value) ? '' : this.form.controls.firstName.value.replace(/ /g, ''))
        );
    }

    /**
     * get client type from
     */
    getClientType = () => this.form.get('type').value;

    /** check is client particulier */
    isClientParticulier() {
        return this.form.get('type').value === ClientType.Particulier;
    }

    /** check is client professionnel */
    isClientProfessionnel() {
        return this.form.get('type').value === ClientType.Professionnel;
    }

    /** check is client Obliges */
    isClientOblige() {
        return this.form.get('type').value === ClientType.Obliges;
    }

    /**
     *  charge dropdown Client
     */
    chargeDropDownClientType() {
        if (this.types.includes(ClientType.Obliges) && this.types.length < 2) {
            this.form.get('type').setValue('Obliges');
            this.generateChampsClient();
        } else if (this.types.length === 2) {
            this.clientType = ConversionHelper.convertEnumToListKeysValues(ClientType, 'number');
            this.clientType.forEach(e => e.text = `CL_TYPE.${e.value}`);
        } else {
            this.clientType = ConversionHelper.convertEnumToListKeysValues(ClientType, 'number');
            this.clientType.forEach(e => e.text = `CLIENT_TYPE.${e.value}`);
        }
    }

    /** charge genre client */
    chargeDropDownGenreClient() {
        this.genreClient = ConversionHelper.convertEnumToListKeysValues(GenreClient, 'number');
        this.genreClient.forEach(e => e.text = `GENRE_CLIENT.${e.value}`);
    }

    /**
     * cancel edit
     */
    cancel() {
        this.modalController.dismiss();
    }

    //#endregion
}
