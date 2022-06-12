import { Location } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ClientType } from 'src/app/core/enums/client-type.enum';
import { DossierStatus } from 'src/app/core/enums/dossier-status.enums';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { StringHelper } from 'src/app/core/helpers/string';
import { Address } from 'src/app/core/models/general/address.model';
import { IContact } from 'src/app/core/models/general/contacts.model';
import { ToastService, ToastTypes } from 'src/app/core/services/toast.service';
import { IClient, IClientListModel } from 'src/app/pages/clients/client.model';
import { BaseDocumentsComponent } from 'src/app/shared/base-features/base-documents.component';
import { PopoverComponent } from 'src/app/shared/popover/popover.component';
import { IDossier, IDossierModel } from '../../dossier.model';
import { AssignCommercialComponent } from '../assign-commercial/assign-commercial.component';

@Component({
    selector: 'app-edit-dossier',
    templateUrl: './edit-dossier.component.html',
    styleUrls: [
        '../../../../../assets/components/input.scss',
        '../../../../../assets/components/grid.scss'
    ],
})
export class EditDossierComponent extends BaseDocumentsComponent<IDossierModel> {

    @Output()
    refresh = new EventEmitter();

    @Output()
    generateReferenceEvent = new EventEmitter();

    @Input()
    set Dossier(dossier: IDossier) {
        if (dossier != null) {
            this.dossier = dossier;
            this.selectedClient = dossier.client;
            this.selectedClient.id = dossier.clientId;
            this.selectedPrimeCee = dossier.primeCEE;
            this.siteIntervention = dossier.siteIntervention;
            this.contact = dossier.contact;
            this.currentStatus = dossier.status;
            this.informationsSupplementaire = dossier.siteInstallationInformationsSupplementaire;
        }
        if (this.isShowMode()) {
            this.form.disable();
        }
    }

    /** current selected client */
    selectedClient: IClient;

    /** the site intervention */
    siteIntervention: Address;

    /** the current status of dossier in edit and show */
    currentStatus: DossierStatus;

    /** the current dossier of this object  */
    dossier: IDossier;

    /** the contact */
    contact: IContact;

    /** the client type */
    clientType = ClientType;

    /** the status of dossier */
    status = DossierStatus;

    selectedPrimeCee: IClientListModel;

    /** the additional information of site installation */
    informationsSupplementaire: { [key: string]: string; };

    constructor(
        private translate: TranslateService,
        private toastService: ToastService,
        public modalController: ModalController,
        public popoverCtrl: PopoverController,
        public navCtrl: NavController,
        public router: Router,
        public location: Location,
    ) {
        super(modalController, navCtrl, router, location);
    }

    //#region form

    /**
     * setData form
     */
    setDataClientInForm(client: IClient) {
        this.form.get('dateReceptionLead').setValue(client.dateReceptionLead);
        this.form.get('logementTypeId').setValue(client.logementTypeId);
        this.form.get('typeChauffageId').setValue(client.typeChauffageId);
        this.form.get('parcelleCadastrale').setValue(client.parcelleCadastrale);
        this.form.get('sourceLead').setValue(client.sourceLead);
        this.form.get('surfaceTraiter').setValue(client.surfaceTraiter);
        this.form.get('precarite').setValue(client.precarite);
        this.form.get('nombrePersonne').setValue(client.nombrePersonne);
        this.form.get('isMaisonDePlusDeDeuxAns').setValue(client.isMaisonDePlusDeDeuxAns);
        this.form.get('revenueFiscaleReference').setValue(client.revenueFiscaleReference);
        this.form.get('numeroDHA').setValue(client.numeroDHA);
        this.form.get('typeTravaux').setValue(client.typeTravaux);
        this.selectedPrimeCee = client.primeCEE;
    }

    //#endregion

    //#region save changes

    /**
     * save Changes
     */
    async saveBase(callback: () => Promise<IDossierModel>) {
        if (this.form.valid) {
            if (this.form.value.firstPhoneNumber === this.form.value.secondPhoneNumber) {
                this.toastService.presentToast(
                    { message: this.translate.instant('ERRORS.PHONE_NUMBER_NOT_UNIQUE'), type: ToastTypes.Danger });
                return;
            } else {
                const dossier: IDossierModel = await callback();

                if (dossier != null) {
                    if (this.isEditMode()) {
                        this.editEvent.emit(dossier);
                    } else {
                        this.addEvent.emit(dossier);
                    }
                }
            }
        } else {
            this.toastService.presentToast({ message: this.translate.instant('ERRORS.FILL_ALL'), type: ToastTypes.Danger });
            this.form.markAllAsTouched();
        }
    }

    /**
     * save changes
     */
    async save(status: DossierStatus, isValider: boolean = false) {
        this.saveBase(async () => {
            let commercialId = null;
            let dateRDV = null;

            if (status === DossierStatus.Assigne) {
                const result = await this.assignerDossier(isValider);
                if (result != null) {
                    commercialId = result.commercialId;
                    dateRDV = result.dateRDV;
                }
                if (result == null) {
                    return;
                }
            }

            return this.buildDossierObject(status, commercialId, dateRDV);
        });
    }

    /**
     * save Changes
     */
    async valide(status: DossierStatus) {
        this.saveBase(async () => {
            let commercialId = null;
            let dateRDV = null;

            if (this.dossier.commercialId == null) {
                const result = await this.assignerDossier();
                if (result != null) {
                    commercialId = result.commercialId;
                    dateRDV = result.dateRDV;
                }
                if (result == null) {
                    return;
                }
            } else {
                commercialId = this.dossier.commercialId;
                dateRDV = this.dossier.dateRDV;
            }

            return this.buildDossierObject(status, commercialId, dateRDV);
        });
    }
    //#endregion

    //#region dialog

    /**
     * open dialog validation assignation
     */
    async assignerDossier(isValider?: boolean) {
        const data = this.dossier == null ? {
            isValider
        } : {
                commercialId: this.dossier.commercialId,
                dateRDV: this.dossier.dateRDV,
                dossierId: this.dossier.id,
                isValider,
            };
        return await DialogHelper.openDialog(this.modalController, AssignCommercialComponent, data);
    }

    //#endregion

    //#region helpers

    /**
     * build dossier object
     */
    buildDossierObject(status: DossierStatus, commercialId: string, dateRDV: Date): IDossierModel {
        const dossierModel: IDossierModel = { ...this.form.value };
        dossierModel.status = status;
        dossierModel.commercialId = commercialId;
        dossierModel.dateRDV = dateRDV;

        if (this.siteIntervention != null) {
            dossierModel.siteIntervention = this.siteIntervention != null ? this.siteIntervention : null;
        }

        if (this.contact != null) {
            dossierModel.contact = this.contact != null ? this.contact : null;
        }

        dossierModel.clientId = this.selectedClient != null ? this.selectedClient.id : null;
        dossierModel.siteInstallationInformationsSupplementaire = this.informationsSupplementaire;

        dossierModel.primeCEEId = !StringHelper.isEmptyOrNull(dossierModel.primeCEEId) ? dossierModel.primeCEEId : null;
        return dossierModel;
    }

    /**
     * save dossier
     */
    async getOptions() {
        if (this.form.valid) {
            const popover = await this.popoverCtrl.create({
                component: PopoverComponent,
                componentProps: {
                    items: [
                        {
                            text: this.translate.instant('STATUS.ENATTENTE'),
                            icon: 'create-outline',
                            action: () => this.save(DossierStatus.EnAttente),
                            appear: this.canEnAttend()
                        },
                        {
                            text: this.translate.instant('STATUS.VALIDE'),
                            icon: 'checkmark-outline',
                            action: () => this.save(DossierStatus.Assigne, true),
                            appear: this.canEnAttend()
                        },
                        {
                            text: this.translate.instant('STATUS.ASSIGNE'),
                            icon: 'checkmark-done-outline',
                            action: () => this.save(DossierStatus.Assigne),
                            appear: this.canAssigne()
                        },
                        {
                            text: this.translate.instant('STATUS.VALIDE'),
                            icon: 'checkmark-done-circle-outline',
                            action: () => this.valide(DossierStatus.Assigne),
                            appear: this.canValiderDuringEdit()
                        },
                        {
                            text: this.translate.instant('STATUS.PERDU'),
                            icon: 'trash-outline',
                            action: () => this.save(DossierStatus.Perdu),
                            appear: this.canPerdu()
                        }
                    ]
                },
                event,
                translucent: false,
            });
            return await popover.present();
        } else {
            this.form.markAllAsTouched();
            this.toastService.presentToast({ message: this.translate.instant('ERRORS.FILL_ALL'), type: ToastTypes.Danger });
        }
    }

    //#endregion

    //#region validations

    /**
     * can show documents associate
     */
    canShowDocumentsAssociate() {
        if (this.dossier == null) { return false; }
        return DossierStatus.EnAttente !== this.dossier.status;
    }

    /**
     * can dossier be en attend
     */
    private canEnAttend() {
        return this.isAddMode() || [DossierStatus.EnAttente].includes(this.currentStatus);
    }

    /**
     * can dossier be en attend
     */
    private canValiderDuringEdit() {
        return this.isEditMode() && [DossierStatus.EnAttente, DossierStatus.Assigne].includes(this.currentStatus);
    }

    /**
     * can dossier be assigne
     */
    private canAssigne() {
        return [DossierStatus.Assigne, DossierStatus.EnAttente, DossierStatus.EnRetard].includes(this.currentStatus);
    }

    /**
     * can dossier be perdu
     */
    private canPerdu() {
        return [DossierStatus.Assigne, DossierStatus.EnRetard].includes(this.currentStatus);
    }

    /**
     * can validation click show
     */
    canModify() {
        return [DossierStatus.Signe, DossierStatus.Facture, DossierStatus.Realise].includes(this.currentStatus);
    }

    canManagePV() {
        return [
            DossierStatus.Realise,
            DossierStatus.APlanifie,
            DossierStatus.Planifie,
            DossierStatus.Signe,
            DossierStatus.Facture,
        ].includes(this.currentStatus);
    }

    //#endregion

    //#region view helpers

    /**
     * display title
     */
    displayTitle() {
        return this.isNavigationRoute && this.isEditMode() ? 'SHOW.TITLE' : this.displayHeaderTitle();
    }

    /**
     * set site d'intervention
     */
    setSiteIntervention(address: Address) {
        this.siteIntervention = address;
    }

    /**
     * set contact
     */
    setContact(contact: IContact) {
        this.contact = contact;
    }

    /**
     * set the additional information of site installation
     */
    setInformationsSupplementaire(value: { [key: string]: string; }) {
        this.informationsSupplementaire = value;
    }

    /**
     * select client
     */
    chooseClient(client: IClient) {
        this.selectedClient = client;
        this.setDataClientInForm(this.selectedClient);
        this.form.get('firstPhoneNumber').setValue(this.selectedClient.phoneNumber);
        this.generateDossierReference(client.id);
    }

    /**
     * generer reference a un dossier
     */
    generateDossierReference(id: string) {
        this.generateReferenceEvent.emit(id);
    }

    //#endregion

}
