import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DossierStatus } from 'src/app/core/enums/dossier-status.enums';
import { NumerationType } from 'src/app/core/enums/numerotation.enum';
import { ResultStatus } from 'src/app/core/enums/result-status';
import { StringHelper } from 'src/app/core/helpers/string';
import { Address } from 'src/app/core/models/general/address.model';
import { IContact } from 'src/app/core/models/general/contacts.model';
import { NumerotationService } from 'src/app/core/services/numerotation-service/numerotation.service';
import { ToastService, ToastTypes } from 'src/app/core/services/toast.service';
import { IEchangeCommercial } from 'src/app/pages/agenda-commercial/echange-commercial.model';
import { IClient } from 'src/app/pages/clients/client.model';
import { ClientsService } from 'src/app/pages/clients/client.service';
import { IDossierModel } from 'src/app/pages/dossier/dossier.model';
import { BaseEditComponent } from '../base-features/base-edit.component';

@Component({
    selector: 'app-saisie-libre-dossier',
    templateUrl: './saisie-libre-dossier.component.html',
    styleUrls: ['../../../assets/components/input.scss',
        '../../../assets/components/grid.scss'],
})
export class SaisieLibreDossierComponent extends BaseEditComponent<IDossierModel>   {

    selectedClient: IClient;
    siteIntervention: Address;
    contact: IContact;
    echangeCommercial: IEchangeCommercial;

    constructor(
        private modalController: ModalController,
        private numerationService: NumerotationService,
        private toastService: ToastService,
        private translate: TranslateService,
        private clientsService: ClientsService,
        private navParams: NavParams,
        private fb: FormBuilder
    ) {
        super();
        this.echangeCommercial = this.navParams.get('echangeCommercial');
        this.selectedClient = this.echangeCommercial.client;
        this.initializationForm();
        this.generateReferenceDossier(this.selectedClient.id);
    }

    //#region form

    initializationForm() {
        this.form = this.fb.group({
            reference: [null, [Validators.required]],
            firstPhoneNumber: [null, [Validators.required]],
            secondPhoneNumber: [null],
            note: [null],
            datePose: [null, [Validators.required]],
            dateCreation: [null],
            dateExpiration: [null],
            dateRDV: [null],
            commercial: [null],
            clientId: [null],
            siteIntervention: [null, [Validators.required]],
            primeCEEId: [null],
            typeTravaux: [null],
            numeroDHA: [null],
            revenueFiscaleReference: [null],
            precarite: [null],
            sourceLead: [null],
            isMaisonDePlusDeDeuxAns: [null],
            nombrePersonne: [null],
            surfaceTraiter: [null],
            parcelleCadastrale: [null],
            logementTypeId: [null],
            typeChauffageId: [null],
            dateReceptionLead: [null],
            contacts: [null]
        });
    }

    //#endregion

    //#region services

    generateReference(type: NumerationType) {
        this.subs.sink = this.numerationService.GenerateNumerotation(type)
            .subscribe(item => {
                if (item.status === ResultStatus.Succeed) {
                    this.form.get('reference').setValue(item.value);
                }
            });
    }

    /**
     * generate reference dossier par client
     */
    generateReferenceDossier(id: string) {
        this.clientsService.Get(id).subscribe(item => {
            if (item.status === ResultStatus.Succeed) {
                const type = item.value.isSousTraitant ?
                    this.generateReference(NumerationType.SOUS_TRAITANT) : this.generateReference(NumerationType.DOSSIER);
            }
        });
    }
    //#endregion

    //#region save data

    buildDossierObject(): IDossierModel {
        const dossierModel: IDossierModel = { ...this.form.getRawValue() };
        dossierModel.siteIntervention = this.siteIntervention;
        dossierModel.contact = this.contact;
        dossierModel.clientId = this.selectedClient.id;
        dossierModel.sourceLead = this.selectedClient.sourceLead;
        dossierModel.dateReceptionLead = this.selectedClient.dateReceptionLead;
        dossierModel.logementTypeId = this.selectedClient.logementTypeId;
        dossierModel.typeChauffageId = this.selectedClient.typeChauffageId;
        dossierModel.parcelleCadastrale = this.selectedClient.parcelleCadastrale;
        dossierModel.surfaceTraiter = this.selectedClient.surfaceTraiter;
        dossierModel.nombrePersonne = this.selectedClient.nombrePersonne;
        dossierModel.precarite = this.selectedClient.precarite;
        dossierModel.revenueFiscaleReference = this.selectedClient.revenueFiscaleReference;
        dossierModel.typeTravaux = this.selectedClient.typeTravaux;
        dossierModel.primeCEEId = this.selectedClient.primeCEEId;
        dossierModel.isMaisonDePlusDeDeuxAns = this.selectedClient.isMaisonDePlusDeDeuxAns;
        dossierModel.memos = this.echangeCommercial.memos;
        if (!StringHelper.isEmptyOrNull(this.echangeCommercial.responsableId)) {
            dossierModel.status = DossierStatus.Assigne;
            dossierModel.commercialId = this.echangeCommercial.responsableId;
            dossierModel.dateRDV = this.echangeCommercial.dateEvent as any as Date;
            dossierModel.premierRdvId = this.echangeCommercial.id;
        } else {
            dossierModel.status = DossierStatus.EnAttente;
        }
        return dossierModel;
    }

    /**
     * save client
     */
    save() {
        if (this.form.valid) {
            this.modalController.dismiss(this.buildDossierObject());
        } else {
            this.toastService.presentToast({ message: this.translate.instant('ERRORS.FILL_ALL'), type: ToastTypes.Danger });
            this.form.markAllAsTouched();
        }
    }

    //#endregion

    //#region helpers

    /**
     * cancel edit
     */
    cancel() {
        this.modalController.dismiss();
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

    //#endregion

}
