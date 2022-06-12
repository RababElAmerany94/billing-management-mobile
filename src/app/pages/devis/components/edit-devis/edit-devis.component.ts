import { Location } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ClientType } from 'src/app/core/enums/client-type.enum';
import { DevisStatus } from 'src/app/core/enums/devis-status.enum';
import { DevisType } from 'src/app/core/enums/devis-type.enum';
import { CalculationToken, ICalculation } from 'src/app/core/helpers/calculation/icalculation';
import { DevisHelper } from 'src/app/core/helpers/devis';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { StringHelper } from 'src/app/core/helpers/string';
import { UserHelper } from 'src/app/core/helpers/user';
import { Address } from 'src/app/core/models/general/address.model';
import { IDocumentAssociate } from 'src/app/core/models/general/documentAssociate.model';
import { ToastService, ToastTypes } from 'src/app/core/services/toast.service';
import { IClient } from 'src/app/pages/clients/client.model';
import { IDossier } from 'src/app/pages/dossier/dossier.model';
import { BaseDocumentsComponent } from 'src/app/shared/base-features/base-documents.component';
import { PopoverComponent } from 'src/app/shared/popover/popover.component';
import { IUser } from '../../../../core/models/user/userModel';
import { ValidationDevisComponent } from '../../../../shared/validation-devis/validation-devis.component';
import { DevisSignatureModel, IDevis, IDevisModel } from '../../devis.model';
import { PopUpStatusComponent } from '../pop-up-status/pop-up-status.component';

@Component({
    selector: 'app-edit-devis',
    templateUrl: './edit-devis.component.html',
    styleUrls: [
        '../../../../../assets/components/input.scss',
        '../../../../../assets/components/grid.scss'],
})
export class EditDevisComponent extends BaseDocumentsComponent<IDevisModel>   {

    /** event download pdf devis */
    @Output()
    downloadEvent = new EventEmitter();

    /** event print pdf devis */
    @Output()
    printDevisEvent = new EventEmitter();

    @Output()
    dupliquerEvent = new EventEmitter();

    @Output()
    enPerduDevisEvent = new EventEmitter();

    @Output()
    signeDevisEvent = new EventEmitter();

    /** signature devis event */
    @Output()
    signatureDevisEvent = new EventEmitter<DevisSignatureModel>();

    /** set the devis */
    @Input()
    set Devis(devis: IDevis) {
        if (devis != null) {
            this.siteIntervention = devis.siteIntervention;
            this.selectedClient = devis.client;
            this.bonCommandeId = devis.bonCommandeId;
            this.selectedUser = devis.user as IUser;
            this.devis = devis;
            this.articles = devis.articles;
            this.currentStatus = devis.status;
            this.relatedDocs = devis.documentAssociates;
            this.nouveauAvancementPercent = DevisHelper.percentFacturationDevis(this.calculation, devis);
        }
        this.setDefaultUser();
    }

    /** set the type of devis */
    @Input()
    set Type(type: DevisType) {
        if (type != null) {
            this.currentType = type;
        }
    }

    /** set the dossier of devis */
    @Input()
    set Dossier(dossier: IDossier) {
        if (dossier != null) {
            this.dossier = dossier;
            this.setDefaultUser();
            this.form.get('clientId').setValue(this.dossier.clientId);
        }
    }

    /** the site intervention */
    siteIntervention: Address;

    /** the enumeration status of devis */
    status = DevisStatus;

    /** the current status of devis in edit and show */
    currentStatus: DevisStatus;

    /** the current devis to modify */
    devis: IDevis;

    /** the current type of devis */
    currentType: DevisType;

    /** the type of the */
    devisType = DevisType;

    /** the dossier of devis */
    dossier: IDossier;

    /** the enumeration of client types */
    clientType = ClientType;

    /** the model of signature devis */
    devisSignatureModel: DevisSignatureModel;

    /** current selected client  */
    selectedUser: IUser;

    /** related documents */
    relatedDocs: IDocumentAssociate[] = [];

    /** percent of facturation */
    nouveauAvancementPercent: number;

    bonCommandeId: string;

    constructor(
        @Inject(CalculationToken) private calculation: ICalculation,
        public router: Router,
        private translate: TranslateService,
        private toastService: ToastService,
        public modalController: ModalController,
        public popoverCtrl: PopoverController,
        public navCtrl: NavController,
        public location: Location,
    ) {
        super(modalController, navCtrl, router, location);
    }

    //#region save changes

    /**
     * save changes
     */
    private save(status: DevisStatus) {
        if (status !== DevisStatus.Brouillon && this.resultCalculation && this.resultCalculation.articles.length === 0) {
            this.toastService.presentToast({ message: this.translate.instant('ERRORS.ADD_LEAST_ARTICLE'), type: ToastTypes.Danger });
            return;
        }
        const devis = this.buildDevisObject(status);
        if (this.isEditMode()) {
            this.editEvent.emit(devis);
        } else {
            this.addEvent.emit(devis);
        }
    }

    /** signee devis */
    async signerDevis() {
        const result = await this.openSignatureDialog();
        if (result == null || result === '') {
            return;
        } else {
            this.devisSignatureModel = {
                devisId: this.devis.id,
                nameClientSignature: result.nameClientSignature,
                signe: result.signe
            };
            this.signatureDevisEvent.emit(this.devisSignatureModel);
        }
    }

    //#endregion

    //#region dialog

    /**
     * open signature dialog
     */
    async openSignatureDialog() {
        const modal = await this.modalController.create({
            component: ValidationDevisComponent,
            componentProps: {},
            animated: true
        });
        modal.present();
        return modal.onDidDismiss().then((result) => {
            return result.data;
        });
    }

    //#endregion

    //#region helpers

    /**
     * build dossier object
     */
    buildDevisObject(status: DevisStatus): IDevisModel {
        const devisModel: IDevisModel = { ...this.form.value };

        devisModel.status = status;

        if (this.siteIntervention != null) {
            devisModel.siteIntervention = this.siteIntervention;
        }

        devisModel.totalReduction = this.resultCalculation.totalReduction;
        devisModel.totalPaid = this.resultCalculation.totalPaid;
        devisModel.totalTTC = this.resultCalculation.totalTTC;

        devisModel.articles = this.resultCalculation.articles;
        devisModel.totalHT = this.resultCalculation.remise > 0 ? this.resultCalculation.totalHTRemise : this.resultCalculation.totalHT;

        devisModel.bonCommandeId = this.bonCommandeId;

        if (UserHelper.isFollowAgence()) {
            devisModel.agenceId = UserHelper.getAgenceId();
        }

        if (this.currentType != null) {
            devisModel.type = this.currentType;
        } else {
            devisModel.type = DevisType.Normal;
        }

        if (this.dossier != null) {
            devisModel.dossierId = this.dossier.id;
            devisModel.clientId = this.dossier.clientId;
            devisModel.siteIntervention = this.dossier.siteIntervention;
        } else {
            devisModel.clientId = this.selectedClient.id;
        }

        return devisModel;
    }

    async saveDevis() {
        if (this.form.valid) {
            const popover = await this.popoverCtrl.create({
                component: PopoverComponent,
                componentProps: {
                    items: [
                        {
                            text: this.translate.instant('STATUS.BROUILLON'),
                            icon: 'create-outline',
                            action: () => this.save(DevisStatus.Brouillon),
                            appear: true
                        },
                        {
                            text: this.translate.instant('STATUS.VALIDE'),
                            icon: 'checkmark-outline',
                            action: () => this.save(DevisStatus.Valider),
                            appear: true
                        }
                    ]
                },
                event,
                translucent: false
            });
            return await popover.present();
        } else {
            this.form.markAllAsTouched();
            this.toastService.presentToast({ message: this.translate.instant('ERRORS.FILL_ALL'), type: ToastTypes.Danger });
        }
    }

    /**
     * more actions
     */
    async onMoreClick() {
        const popover = await this.popoverCtrl.create({
            component: PopoverComponent,
            componentProps: {
                items: [
                    {
                        text: this.translate.instant('LABELS.DOWNLOAD'),
                        icon: 'download-outline',
                        action: () => this.downloadPdf(),
                        appear: this.isShowMode()
                    },
                    {
                        text: this.translate.instant('LABELS.IMPRIMER'),
                        icon: 'print-outline',
                        action: () => this.printPdf(),
                        appear: this.isShowMode()
                    },
                    {
                        text: this.translate.instant('LABELS.DUPLIQUER'),
                        icon: 'add-outline',
                        action: () => this.dupliquerEvent.emit(this.devis),
                        appear: this.isShowMode()
                    },
                    {
                        text: this.translate.instant('STATUS.SIGNE'),
                        icon: 'analytics-outline',
                        action: () => this.signerDevis(),
                        appear: DevisHelper.canSigne(this.devis.status),
                    },
                    {
                        text: this.translate.instant('LABELS.MARQUE_SIGNE'),
                        icon: 'checkmark-done-outline',
                        action: () => this.signeDevis(),
                        appear: this.isShowMode()
                    },
                    {
                        text: this.translate.instant('STATUS.PERDU'),
                        icon: 'trash-outline',
                        action: () => this.enPerduDevis(),
                        appear: this.isShowMode()
                    },
                    {
                        text: this.translate.instant('EMAILS.SEND'),
                        icon: 'send-outline',
                        action: () => this.sendEmail({
                            emails: this.devis.emails ? this.devis.emails : [],
                            contacts: this.devis.client.contacts,
                            type: this.devis,
                            canRevive: false
                        }, (result) => {
                            if (result != null) {
                                this.SendEmailEvent.emit(result);
                            }
                        }),
                        appear: this.isShowMode()
                    }
                ]
            },
            event,
            translucent: false
        });
        return await popover.present();
    }
    //#endregion

    //#region setters views

    /**
     * set site d'intervention
     */
    setSiteIntervention(address: Address) {
        this.siteIntervention = address;
    }

    /** select client */
    async chooseClient(client: IClient) {
        this.selectedClient = client;
        if (this.selectedClient.commercial && this.isAddMode()) {
            this.selectedUser = this.selectedClient.commercial;
        }
    }

    /** display title  */
    displayTitle() {
        return this.isNavigationRoute && this.isEditMode() ? 'SHOW.TITLE' : this.displayHeaderTitle();
    }

    /**
     * change status to perdu devis
     */
    enPerduDevis() {
        this.devis.status = this.status.EnPerdu;
        const data = { isSigne: false };
        DialogHelper.openDialog(this.modalController, PopUpStatusComponent, data).then(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.devis.raisonPerdue = result.raisonPerdue;
                this.enPerduDevisEvent.emit(this.devis);
            }
        });
    }

    /**
     * change status to signe devis
     */
    signeDevis() {
        this.devis.status = this.status.Signe;
        const data = { isSigne: true };
        DialogHelper.openDialog(this.modalController, PopUpStatusComponent, data).then(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.devis.dateSignature = result.dateSignature;
                this.signeDevisEvent.emit(this.devis);
            }
        });
    }

    isSigne() {
        return this.isShowMode() && this.currentStatus !== this.status.Signe
            && (this.currentStatus === this.status.Encours || this.currentStatus === this.status.Enretard);
    }

    isDevisSignee(status: DevisStatus) {
        return status === this.status.Signe && this.isShowMode();
    }

    //#endregion

    //#region helpers

    isContactCOMPANY() {
        return this.currentType !== this.devisType.Normal;
    }

    private setDefaultUser() {
        if (this.isAddMode()) {
            this.selectedUser = UserHelper.getCurrentUser();
        }
    }

    //#endregion

}
