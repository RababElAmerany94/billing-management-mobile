import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AgendaCommercialListTabs } from 'src/app/core/enums/agenda-commercial-list-tabs.enum';
import { AgendaEvenementType } from 'src/app/core/enums/agenda-evenement-type.enum';
import { EchangeCommercialStatus } from 'src/app/core/enums/echange-commercial-status.enum';
import { EchangeCommercialType } from 'src/app/core/enums/echange-commercial-type.enum';
import { ArrayHelper } from 'src/app/core/helpers/array';
import { IUser } from 'src/app/core/models/user/userModel';
import { ToastService, ToastTypes } from 'src/app/core/services/toast.service';
import { BaseDocumentsComponent } from '../../../../shared/base-features/base-documents.component';
import { AgendaCommercialService } from '../../agenda-commercial.service';
import { ICheckRdvIsExistModel, IEchangeCommercial } from '../../echange-commercial.model';
import { EchangeCommercialPriority } from './../../../../core/enums/echange-commercial-priority.enum';
import { ModeEnum } from './../../../../core/enums/mode.enum';
import { ConversionHelper } from './../../../../core/helpers/conversion';
import { DateHelper } from './../../../../core/helpers/date';
import { DialogHelper } from './../../../../core/helpers/dialog';
import { Address } from './../../../../core/models/general/address.model';
import { IContact } from './../../../../core/models/general/contacts.model';
import { IDropDownItem } from './../../../../core/models/general/drop-down-item.model';
import { IClient } from './../../../clients/client.model';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: [
        '../../../../../assets/components/input.scss',
        '../../../../../assets/components/grid.scss'
    ],
})
export class EditComponent extends BaseDocumentsComponent<IEchangeCommercial> implements OnInit {

    @Input()
    set EchangeCommercial(echangeCommercial: IEchangeCommercial) {
        if (echangeCommercial != null) {
            this.echangeCommercial = echangeCommercial;
            this.selectedClient = echangeCommercial.client;
            this.selectedResponsable = echangeCommercial.responsable;
            this.contacts = echangeCommercial.contacts as IContact[];
            this.address = echangeCommercial.addresses as Address[];
        }
        if (this.isShowMode()) {
            this.form.disable();
        }
    }

    @Input()
    set type(value: AgendaCommercialListTabs) {
        if (value != null) {
            this.typeTabs = value;
        }
    }

    /** the current echangeCommercial of this object  */
    echangeCommercial: IEchangeCommercial;

    /** list addresses */
    address: Address[] = [];

    /** list contacts */
    contacts: IContact[] = [];

    /** the status of agenda types */
    status = EchangeCommercialStatus;

    /** types agenda commercial */
    types = AgendaCommercialListTabs;

    /** the type of this tabs */
    typeTabs: AgendaCommercialListTabs;

    /** the priorite */
    priorite: IDropDownItem<number, string>[] = [];

    /** types events  */
    agendaEvenementTypes = AgendaEvenementType;

    /** selected responsable */
    selectedResponsable: IUser;

    constructor(
        public router: Router,
        public navCtrl: NavController,
        public modalController: ModalController,
        private alertController: AlertController,
        private translate: TranslateService,
        private toastService: ToastService,
        private echangeCommercialService: AgendaCommercialService,
        public location: Location,
    ) {
        super(modalController, navCtrl, router, location);
    }

    ngOnInit() {
        this.chargeDropDownTachePriority();
    }

    buildEchangeCommercialObject(echangeCommercialModel: any): IEchangeCommercial {
        echangeCommercialModel.addresses = !ArrayHelper.isEmptyOrNull(this.address) ? this.address : [];

        echangeCommercialModel.contacts = !ArrayHelper.isEmptyOrNull(this.contacts) ? this.contacts : [];

        if (this.selectedClient != null) {
            echangeCommercialModel.clientId = this.selectedClient.id;
        } else if (this.echangeCommercial != null) {
            echangeCommercialModel.clientId = this.echangeCommercial.clientId;
        }

        echangeCommercialModel.time = DateHelper.isValidDate(this.form.controls.time.value) ?
            DateHelper.formatTime(this.form.controls.time.value) : this.form.controls.time.value;
        echangeCommercialModel.dateEvent = DateHelper.formatDate(this.form.controls.dateEvent.value);
        echangeCommercialModel.status = this.mode === ModeEnum.Add ? EchangeCommercialStatus.enCours : this.echangeCommercial.status;

        return echangeCommercialModel;
    }

    /**
     * save client
     */
    saveEchangeCommercial(values: any) {
        if (this.isAddMode()) {
            this.addEvent.emit(this.buildEchangeCommercialObject(values));
        } else {
            this.editEvent.emit(this.buildEchangeCommercialObject(values));
        }
    }

    saveBase() {
        if (this.form.valid) {
            const values = { ...this.form.getRawValue() };
            if (this.typeTabs === AgendaCommercialListTabs.Rdv) {
                const checkRdvIsExistModel: ICheckRdvIsExistModel = {
                    dateEvent: DateHelper.formatDate(values.dateEvent),
                    time: values.time != null && DateHelper.isValidDate(values.time) ? DateHelper.formatTime(values.time) : values.time,
                    clientId: this.selectedClient != null ? this.selectedClient.id : null,
                    responsableId: values.responsableId
                };
                this.checkRdvIsExist(checkRdvIsExistModel, () => {
                    this.saveEchangeCommercial(values);
                });
            } else {
                this.saveEchangeCommercial(values);
            }
        } else {
            this.form.markAllAsTouched();
            this.toastService.presentToast({ message: this.translate.instant('ERRORS.FILL_ALL'), type: ToastTypes.Danger });
        }
    }

    /**
     * check rdv is exist in the same date and hour
     */
    checkRdvIsExist(checkRdvIsExistModel: ICheckRdvIsExistModel, success: () => void): void {
        this.echangeCommercialService.CheckRdvIsExist(checkRdvIsExistModel).subscribe(result => {
            if (result.value === true) {
                DialogHelper.presentAlert(
                    this.alertController,
                    this.translate,
                    {
                        headerText: this.translate.instant('LABELS.CONFIRMATION'),
                        message: this.translate.instant('CHECK_RDV_IS_EXIST.QUESTION'),
                        done: () => success(),
                        cancel: () => { }
                    }
                );
            } else {
                success();
            }
        });
    }

    /**
     * select client
     */
    async changeClient(result: IClient) {
        this.selectedClient = result;
        if (this.geType() === EchangeCommercialType.Appel || this.geType() === EchangeCommercialType.RDV) {
            this.form.get('phoneNumber').setValue(this.selectedClient.phoneNumber);
        }
    }

    getStatus(status: EchangeCommercialStatus) {
        return `ECHANGE_COMMERCIAL_STATUS.${status}`;
    }

    /**
     * display title
     */
    displayTitle() {
        if (this.isAddMode()) {
            return this.getTitle(this.getNameTypeByTabs(this.typeTabs));
        } else if (this.echangeCommercial != null) {
            return this.getTitle(this.getNameType(this.echangeCommercial.type));
        }
    }

    /** charge dropdown priority */
    chargeDropDownTachePriority() {
        this.priorite = ConversionHelper.convertEnumToListKeysValues(EchangeCommercialPriority, 'number');
        this.priorite.forEach(e => e.text = `TACHE_PRIORITY.${e.value}`);
    }

    /**
     * title of pop up
     */
    getTitle(name: string) {
        switch (this.mode) {
            case ModeEnum.Add:
                return `${name}.ADD_TITLE`;

            case ModeEnum.Edit:
                return `${name}.EDIT_TITLE`;

            case ModeEnum.Show:
                return `${name}.SHOW_TITLE`;
        }
    }

    /**
     * name of pop up
     */
    getNameTypeByTabs(type: AgendaCommercialListTabs) {
        switch (type) {
            case AgendaCommercialListTabs.Appel:
                return 'APPELS';

            case AgendaCommercialListTabs.Rdv:
                return 'RENDEZ-VOUS';

            case AgendaCommercialListTabs.Tache:
                return 'TACHE';
        }
    }

    /**
     * name of pop up
     */
    getNameType(type: EchangeCommercialType) {
        switch (type) {
            case EchangeCommercialType.Appel:
                return 'APPELS';

            case EchangeCommercialType.RDV:
                return 'RENDEZ-VOUS';

            case EchangeCommercialType.Tache:
                return 'TACHE';
        }
    }

    /**
     * name of pop up
     */
    geType() {
        switch (this.typeTabs) {
            case AgendaCommercialListTabs.Appel:
                return EchangeCommercialType.Appel;

            case AgendaCommercialListTabs.Rdv:
                return EchangeCommercialType.RDV;

            case AgendaCommercialListTabs.Tache:
                return EchangeCommercialType.Tache;

            case AgendaCommercialListTabs.Agenda:
                return this.echangeCommercial.type;
        }
    }

    /**
     * set contact
     */
    setContact(contact: IContact) {
        if (contact != null) {
            this.contacts[0] = contact;
        }
    }

    /**
     * set site d'intervention
     */
    setAddress(address: Address) {
        if (address != null) {
            this.address[0] = address;
        }
    }

    /**
     * set addresses
     */
    setAddresses(addresses: Address[]) {
        this.address = addresses;
    }

    /**
     * show add dossier
     */
    showAddDossier() {
        return this.isShowMode() &&
            this.echangeCommercial &&
            !this.echangeCommercial.dossierId &&
            this.echangeCommercial.clientId;
    }

}
