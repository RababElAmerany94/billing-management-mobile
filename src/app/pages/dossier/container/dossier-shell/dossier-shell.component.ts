import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DossierStatus } from 'src/app/core/enums/dossier-status.enums';
import { ModeEnum } from 'src/app/core/enums/mode.enum';
import { NumerationType } from 'src/app/core/enums/numerotation.enum';
import { ResultStatus } from 'src/app/core/enums/result-status';
import { RouteName } from 'src/app/core/enums/route.enum';
import { DossierHelper } from 'src/app/core/helpers/dossier';
import { Memo } from 'src/app/core/models/general/memo.model';
import { IPagedResult } from 'src/app/core/models/general/result-model';
import { LoadingService } from 'src/app/core/services/loading.service';
import { NumerotationService } from 'src/app/core/services/numerotation-service/numerotation.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { TranslationService } from 'src/app/core/services/translation.service';
import { ClientsService } from 'src/app/pages/clients/client.service';
import { BaseContainerComponent } from 'src/app/shared/base-features/base-container.component';
import { AddDevisDocAssociateComponent } from 'src/app/shared/shared-related/add-devis-doc-associate/add-devis-doc-associate.component';
import { DevisType } from '../../../../core/enums/devis-type.enum';
import { DossierListTabs } from '../../../../core/enums/dossier-list-tabs.enum';
import { DialogHelper } from '../../../../core/helpers/dialog';
import { StringHelper } from '../../../../core/helpers/string';
import { IDossierFilterOption } from '../../../../core/models/general/filter-option.model';
import { DossierAssignationModel, IDossier, IDossierModel, IVisteTechnique } from '../../dossier.model';
import { DossierService } from '../../dossier.service';

@Component({
    selector: 'app-dossier-shell',
    templateUrl: './dossier-shell.component.html',
})
export class DossierShellComponent extends BaseContainerComponent {

    /** form group */
    form: FormGroup;

    /** list dossiers */
    dossiers: IPagedResult<IDossier>;

    /** the current folders to modify */
    dossier: IDossier;

    /** selected tabs */
    selectedTabs = DossierListTabs.AValider;

    dossierListTabs = DossierListTabs;

    constructor(
        private dossierService: DossierService,
        protected translate: TranslateService,
        protected numerationService: NumerotationService,
        private clientsService: ClientsService,
        private translationService: TranslationService,
        protected toastService: ToastService,
        private loadingService: LoadingService,
        private fb: FormBuilder,
        public router: Router,
        public modalController: ModalController,
        private route: ActivatedRoute,
        protected location: Location,
    ) {
        super(toastService, translate, router, location);
        this.setModule(this.modules.Dossiers);
        this.translationService.setLanguage(this.translate);
        this.subscribeRouteChanges();
    }

    //#region route

    /**
     * subscribe route changes
     */
    async subscribeRouteChanges() {
        this.route.queryParams.subscribe(queryParams => {
            if (!StringHelper.isEmptyOrNull(queryParams.mode)) {
                const mode = parseInt(queryParams.mode, 10) as ModeEnum;
                this.isNavigationRoute = queryParams.isNavigationRoute;
                switch (mode) {

                    case ModeEnum.List:
                        this.modeList();
                        break;

                    case ModeEnum.Add:
                        this.addEvent();
                        break;

                    case ModeEnum.Edit:
                        this.editEvent(queryParams.id);
                        break;

                    case ModeEnum.Show:
                        this.showEvent(queryParams.id);
                        break;

                }
            }
        });
    }

    /**
     * navigate to add devis
     * @param devisType the type of devis
     */
    navigateToAddDevis(devisType: DevisType, dossierlist: IDossier) {
        const navigationExtras: NavigationExtras = {
            state: {
                dossier: dossierlist,
                type: devisType,
            },
            queryParams: {
                mode: ModeEnum.Add,
                dossierList: true,
                isNavigationRoute: true
            }
        };
        this.router.navigate([`/${RouteName.Devis}`], navigationExtras);
    }

    /**
     * edit agenda to client
     */
    editEventAgenda(id: string) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                id,
                mode: ModeEnum.Edit,
                isNavigationRoute: true
            }
        };
        this.router.navigate([`/${RouteName.AgendaCommercial}`], navigationExtras);
    }

    /**
     * show agenda to client
     */
    showEventAgenda(id: string) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                id,
                mode: ModeEnum.Show,
                isNavigationRoute: true
            }
        };
        this.router.navigate([`/${RouteName.AgendaCommercial}`], navigationExtras);
    }

    //#endregion


    //#region forms

    /**
     * initialize form
     */
    initForm() {
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

    /**
     * set dossier form
     */
    setDossierForm(dossier: IDossier) {
        this.form.patchValue({
            reference: dossier.reference,
            datePose: dossier.datePose,
            dateCreation: dossier.dateExpiration,
            dateExpiration: dossier.dateExpiration,
            clientId: dossier.client.fullName,
            siteIntervention: dossier.siteIntervention,
            firstPhoneNumber: dossier.firstPhoneNumber,
            secondPhoneNumber: dossier.secondPhoneNumber,
            typeChauffageId: dossier.typeChauffageId,
            note: dossier.note,
            dateReceptionLead: dossier.dateReceptionLead,
            sourceLead: dossier.sourceLead,
            logementTypeId: dossier.logementTypeId,
            parcelleCadastrale: dossier.parcelleCadastrale,
            surfaceTraiter: dossier.surfaceTraiter,
            nombrePersonne: dossier.nombrePersonne,
            isMaisonDePlusDeDeuxAns: dossier.isMaisonDePlusDeDeuxAns,
            precarite: dossier.precarite,
            revenueFiscaleReference: dossier.revenueFiscaleReference,
            numeroDHA: dossier.numeroDHA,
            typeTravaux: dossier.typeTravaux,
            primeCEEId: dossier.primeCEE != null ? dossier.primeCEE.fullName : '',
            dateRDV: dossier.dateRDV,
            commercial: dossier.commercial != null ? dossier.commercial.fullName : '',
        });
    }
    //#endregion

    //#region service

    /**
     * get list folders as paged
     * @param filter display all folders
     */
    async getDossiers(filter: IDossierFilterOption) {
        this.loading = true;
        this.dossierService.GetAsPagedResult(filter).subscribe(result => {
            this.loading = false;
            if (result.status === ResultStatus.Succeed) {
                this.dossiers = result;
                this.filterOption = filter;
            } else {
                this.toastErrorServer();
            }
        }, _ => this.loading = false);
    }

    /**
     * get dossier by id
     */
    async getDossierById(id: string, callback: (dossier: IDossier) => void) {
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        this.dossierService.Get(id).subscribe(async result => {
            await this.loadingService.hide();
            if (result.status === ResultStatus.Succeed) {
                callback(result.value);
            } else {
                this.toastErrorServer();
            }
        }, async _ => await this.loadingService.hide());
    }

    /**
     * Add folder action
     */
    async addDossier(dossierModel: IDossierModel) {
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        DossierHelper.CheckReferenceIsUnique(this.dossierService, this.toastService, dossierModel, this.translate, null, true,
            async (checkResult: boolean) => {
                if (checkResult) {
                    this.dossierService.Add(dossierModel).subscribe(async result => {
                        await this.loadingService.hide();
                        if (result.hasValue) {
                            this.toastAddSuccess();
                            this.cancel();
                        } else {
                            this.toastErrorServer();
                        }
                    }, async _ => await this.loadingService.hide());
                } else {
                    await this.loadingService.hide();
                }
            });
    }

    /**
     * add memo dossier to dossier
     * @param memo the memo to add
     */
    async saveMemoDossierToDossier(memos: Memo[]) {
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        this.subs.sink = this.dossierService.SaveMemos(this.dossier.id, memos)
            .subscribe(async result => {
                await this.loadingService.hide();
                if (result.status === ResultStatus.Succeed) {
                    this.toastSaveSuccess();
                    this.dossier.memos = memos;
                }
            }, async _ => await this.loadingService.hide());
    }

    /**
     * Update folder
     */
    async updateDossier(dossierModel: IDossierModel) {
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        DossierHelper.CheckReferenceIsUnique(this.dossierService, this.toastService, dossierModel, this.translate, this.dossier, false,
            async (checkResult: boolean) => {
                if (checkResult) {
                    this.dossierService.Update(this.dossier.id, dossierModel).subscribe(async result => {
                        await this.loadingService.hide();
                        if (result.hasValue) {
                            this.toastEditSuccess();
                            this.cancel();
                        } else {
                            this.toastErrorServer();
                        }
                    }, async _ => await this.loadingService.hide());
                } else {
                    await this.loadingService.hide();
                }
            });
    }

    /**
     * add dossier assignation
     */
    dossierAssignationEvent(dossierAssignationModel: DossierAssignationModel) {
        this.getDossierById(dossierAssignationModel.dossierId, (result) => {
            const dossier = result;
            dossier.commercialId = dossierAssignationModel.commercialId;
            dossier.dateRDV = dossierAssignationModel.dateRDV;
            dossier.status = DossierStatus.Assigne;
            this.dossierService.Update(dossier.id, dossier).subscribe(res => {
                if (res.hasValue) {
                    this.toastEditSuccess();
                    this.getDossiers(this.filterOption);
                    this.modeList();
                } else {
                    this.toastErrorServer();
                }
            });
        });
    }

    /**
     * generate reference dossier
     */
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

    /**
     * delete dossier
     */
    async deleteDossier(id: string) {
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        this.subs.sink = this.dossierService.Delete(id).subscribe(async result => {
            await this.loadingService.hide();
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.getDossiers(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        }, async _ => await this.loadingService.hide());
    }

    /**
     * sync dossier with anstroute
     */
    syncAntsroute(id: string) {
        this.subs.sink = this.dossierService.SynchronizeWithAntsroute(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
                this.getDossiers(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * sync dossier with anstroute
     */
    markDossierAplanifier(id: string) {
        this.subs.sink = this.dossierService.MarkDossierAplanifier(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
                this.getDossiers(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * save visite technique to dossier
     * @param smsModel the SMS model
     */
    saveVisiteTechniqueToDossier(visiteTechnique: IVisteTechnique) {
        this.dossierService.SaveVisteTechnique(this.dossier.id, visiteTechnique).subscribe(res => {
            if (res.status === ResultStatus.Succeed) {
                this.dossier.visteTechnique = visiteTechnique;
                this.toastEditSuccess();
                this.showEvent(this.dossier.id);
            } else {
                this.toastErrorServer();
            }
        });
    }

    //#endregion

    //#region events

    /**
     * add event
     */
    addEvent() {
        this.dossier = null;
        this.initForm();
        this.modeAdd();
    }

    /**
     * show event
     */
    showEvent(id: string) {
        this.initForm();
        this.getDossierById(id, (dossier) => {
            this.dossier = dossier;
            this.setDossierForm(this.dossier);
            this.form.disable();
            this.modeShow(id);
        });
    }

    /**
     * edit event
     */
    editEvent(id: string) {
        this.initForm();
        this.getDossierById(id, (dossier) => {
            this.dossier = dossier;
            this.setDossierForm(this.dossier);
            this.modeEdit(id);
        });
    }

    /**
     * add Devis associate with dossier
     */
    addDevisEvent(dossier: IDossier) {
        const data = { isPrimeCEE: dossier.primeCEEId != null };
        DialogHelper.openDialog(this.modalController, AddDevisDocAssociateComponent, data).then((result) => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.navigateToAddDevis(result as DevisType, dossier);
            }
        });
    }

    //#endregion

    //#region helpers

    /**
     * refresh page
     */
    refreshCurrentElement() {
        this.getDossierById(this.dossier.id, (dossier) => {
            this.dossier = dossier;
            this.setDossierForm(this.dossier);
        });
    }

    public cancel() {
        if (this.isNavigationRoute) {
            this.location.back();
        } else {
            this.getDossiers(this.filterOption);
            this.modeList();
        }
    }
    canAddVisiteTechnique = () => this.dossier &&
        [DossierStatus.EnAttente, DossierStatus.EnRetard, DossierStatus.Perdu].includes(this.dossier.status)

    //#endregion

}
