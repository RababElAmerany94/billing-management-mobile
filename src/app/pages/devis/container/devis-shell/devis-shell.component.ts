import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DevisRouteActions } from 'src/app/core/enums/devis-route-actions.enum';
import { DevisType } from 'src/app/core/enums/devis-type.enum';
import { ModeEnum } from 'src/app/core/enums/mode.enum';
import { NumerationType } from 'src/app/core/enums/numerotation.enum';
import { ResultStatus } from 'src/app/core/enums/result-status';
import { DateHelper } from 'src/app/core/helpers/date';
import { DevisHelper } from 'src/app/core/helpers/devis';
import { FileHelper } from 'src/app/core/helpers/file';
import { StringHelper } from 'src/app/core/helpers/string';
import { IFilterOption } from 'src/app/core/models/general/filter-option.model';
import { IMailModel } from 'src/app/core/models/general/mail.model';
import { IPagedResult } from 'src/app/core/models/general/result-model';
import { LoadingService } from 'src/app/core/services/loading.service';
import { NumerotationService } from 'src/app/core/services/numerotation-service/numerotation.service';
import { ToastService, ToastTypes } from 'src/app/core/services/toast.service';
import { TranslationService } from 'src/app/core/services/translation.service';
import { IDossier } from 'src/app/pages/dossier/dossier.model';
import { DossierService } from 'src/app/pages/dossier/dossier.service';
import { BaseContainerComponent } from 'src/app/shared/base-features/base-container.component';
import { DevisSignatureModel, IDevis, IDevisModel } from '../../devis.model';
import { DevisService } from '../../devis.service';

@Component({
    selector: 'app-devis-shell',
    templateUrl: './devis-shell.component.html',
})
export class DevisShellComponent extends BaseContainerComponent {

    /** FormGroup */
    form: FormGroup;

    /** Folders list */
    devisPagedResult: IPagedResult<IDevis>;

    /** the current folders to modify */
    devis: IDevis;

    /** the filter of folder */
    filterOption: IFilterOption;

    /** the type of devis */
    type: DevisType;

    /** the dossier associate with this of devis */
    dossier: IDossier;

    /** is in mode duplique devis */
    isDupliquer = false;

    constructor(
        private devisService: DevisService,
        protected translate: TranslateService,
        protected numerationService: NumerotationService,
        private translationService: TranslationService,
        private dossierService: DossierService,
        protected toastService: ToastService,
        private loadingService: LoadingService,
        private fb: FormBuilder,
        public router: Router,
        private route: ActivatedRoute,
        protected location: Location
    ) {
        super(toastService, translate, router, location);
        this.setModule(this.modules.Devis);
        this.translationService.setLanguage(this.translate);
        this.subscribeRouteChanges();
    }

    //#region route

    /**
     * subscribe route changes
     */
    async subscribeRouteChanges() {
        const data = this.router.getCurrentNavigation() != null ? this.router.getCurrentNavigation().extras.state : null;
        this.route.queryParams.subscribe(queryParams => {
            if (!StringHelper.isEmptyOrNull(queryParams.mode)) {
                const mode = parseInt(queryParams.mode, 10) as ModeEnum | DevisRouteActions;
                this.isNavigationRoute = queryParams.isNavigationRoute === 'true';
                switch (mode) {

                    case ModeEnum.List:
                        this.modeList();
                        break;

                    case ModeEnum.Add:
                        if (!queryParams.isNavigationRoute && !this.isAddMode()) {
                            this.addEvent();
                        } else if (!this.isAddMode()) {
                            this.addEvent(data.type == null ? DevisType.Normal : data.type);
                            this.dossier = data.dossier;
                        }
                        break;

                    case ModeEnum.Edit:
                        this.editEvent(queryParams.id);
                        break;

                    case ModeEnum.Show:
                        this.showEvent(queryParams.id);
                        break;

                    case ModeEnum.Delete:
                        this.deleteDevis(queryParams.id);
                        break;

                    case ModeEnum.Signe:
                        this.signDevis(data.devisSignatureModel);
                        break;

                    case DevisRouteActions.TransferBonCommandeToDevis:
                        this.devis = data.bonCommande;
                        if (data && this.devis.dossierId) {
                            this.getDossierById(this.devis.dossierId, (result: IDossier) => {
                                this.dossier = result;
                                this.devis.bonCommandeId = this.devis.id;
                                this.type = this.devis.type == null ? DevisType.Normal : this.devis.type;
                                this.initForm();
                                this.modeAdd();
                                this.setDevisForm(this.devis);
                                this.generateReference();
                            });
                        } else {
                            this.devis.bonCommandeId = this.devis.id;
                            this.type = this.devis.type == null ? DevisType.Normal : this.devis.type;
                            this.initForm();
                            this.modeAdd();
                            this.setDevisForm(this.devis);
                            this.generateReference();
                        }
                        break;

                }
            }
        });
    }

    //#endregion

    //#region forms

    /**
     * initialize form
     */
    initForm() {
        this.form = this.fb.group({
            reference: [null, [Validators.required]],
            dateVisit: [DateHelper.formatDate(new Date().toString()), [Validators.required]],
            note: [null],
            userId: [null, [Validators.required]],
            clientId: [null, [Validators.required]],
            siteIntervention: [null],
        });
    }

    /**
     * set devis form
     */
    setDevisForm(devis: IDevis) {
        this.form.patchValue({
            reference: devis.reference,
            dateVisit: devis.dateVisit,
            note: devis.note,
            siteIntervention: devis.siteIntervention,
            clientId: devis.client.fullName,
            userId: devis.user != null ? devis.user.id : null,
        });
    }

    //#endregion

    //#region service

    /**
     * get list folders as paged
     * @param filter display all folders
     */
    getDevis(filter: IFilterOption) {
        this.loading = true;
        this.devisService.GetAsPagedResult(filter).subscribe(result => {
            this.loading = false;
            if (result.status === ResultStatus.Succeed) {
                this.devisPagedResult = result;
                this.filterOption = filter;
            } else {
                this.toastErrorServer();
            }
        }, _ => this.loading = false);
    }

    /**
     * get devis by id
     */
    async getDevisById(id: string, callback: (result: IDevis) => void) {
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        this.devisService.Get(id).subscribe(async result => {
            await this.loadingService.hide();
            if (result.status === ResultStatus.Succeed) {
                callback(result.value);
            } else {
                this.toastErrorServer();
            }
        }, async _ => await this.loadingService.hide());
    }

    /**
     * get dossier by id
     */
    getDossierById(id: string, callback): void {
        this.dossierService.Get(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                callback(result.value);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * Add folder action
     */
    async addDevis(devisModel: IDevisModel) {
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        DevisHelper.CheckReferenceIsUnique(this.devisService, this.toastService, devisModel, this.translate, null, true,
            async (checkResult: boolean) => {
                if (checkResult) {
                    this.devisService.Add(devisModel).subscribe(async result => {
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
     * add signature devis
     */
    signDevis(devisSignatureModel: DevisSignatureModel) {
        this.devisService.SignDevis(devisSignatureModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
                this.cancel();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * Update folder
     */
    async updateDevis(devisModel: IDevisModel) {
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        DevisHelper.CheckReferenceIsUnique(this.devisService, this.toastService, devisModel, this.translate, this.devis, false,
            async (checkResult: boolean) => {
                if (checkResult) {
                    this.devisService.Update(this.devis.id, devisModel).subscribe(async result => {
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
     * generate reference devis
     */
    generateReference() {
        this.subs.sink = this.numerationService.GenerateNumerotation(NumerationType.DEVIS)
            .subscribe(item => {
                if (item.status === ResultStatus.Succeed) {
                    this.form.get('reference').setValue(item.value);
                }
            });
    }

    /**
     * delete devis
     */
    async deleteDevis(id: string) {
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        this.subs.sink = this.devisService.Delete(id).subscribe(async result => {
            await this.loadingService.hide();
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.cancel();
            } else {
                this.toastErrorServer();
            }
        }, async _ => await this.loadingService.hide());
    }

    //#endregion

    //#region events

    /**
     * download pdf event
     */
    downloadPdfEvent() {
        this.subs.sink = this.devisService.DownloadPdf(this.devis.id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                FileHelper.downloadPDF(result.value, 'Devis');
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * print devis
     */
    printDevis() {
        this.subs.sink = this.devisService.DownloadPdf(this.devis.id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                FileHelper.printPdf(result.value, 'Devis');
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * send email
     * @param mailModel the mail model
     */
    async sendEmail(mailModel: IMailModel) {
        await this.loadingService.show(this.translate.instant('EMAILS.SENDING_EMAIL'));
        this.devisService.SendEmail(this.devis.id, mailModel)
            .subscribe(async result => {
                await this.loadingService.hide();
                if (result.status === ResultStatus.Succeed) {
                    this.devis.emails = result.value;
                    this.toastService.presentToast({ message: this.translate.instant('SUCCESS.SEND_EMAIL'), type: ToastTypes.Success });
                } else {
                    this.toastErrorServer();
                }
            }, async _ => {
                this.toastErrorServer();
                await this.loadingService.hide();
            });
    }

    /**
     * add event
     */
    addEvent(type: DevisType = DevisType.Normal) {
        if (!this.isDupliquer) {
            this.devis = null;
        }
        this.type = type == null ? DevisType.Normal : type;
        this.initForm();
        if (this.isDupliquer && this.devis) {
            this.setDevisForm(this.devis);
        }
        this.generateReference();
        this.modeAdd();
    }

    /**
     * show event
     */
    async showEvent(id: string) {
        this.initForm();
        this.getDevisById(id, (devis) => {
            this.devis = devis;
            this.type = this.devis.type;
            this.setDevisForm(this.devis);
            this.form.disable();
            this.modeShow(id);
        });
    }

    /**
     * edit event
     */
    async editEvent(id: string) {
        this.initForm();
        this.getDevisById(id, (devis) => {
            this.devis = devis;
            this.type = this.devis.type;
            this.setDevisForm(this.devis);
            this.modeEdit(id);
        });
    }

    /**
     *  dupliquer event
     */
    async dupliquer(devis: IDevis) {
        await this.getDevisById(devis.id, (result) => {
            this.devis = result;
            this.initForm();
            this.isDupliquer = true;
            this.addEvent(this.devis.type);
        });
    }

    public cancel() {
        if (this.isNavigationRoute) {
            this.location.back();
        } else {
            this.getDevis(this.filterOption);
            this.modeList();
        }
    }

    //#endregion

}
