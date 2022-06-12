import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModeEnum } from 'src/app/core/enums/mode.enum';
import { StringHelper } from 'src/app/core/helpers/string';
import { Memo } from 'src/app/core/models/general/memo.model';
import { IClient } from 'src/app/pages/clients/client.model';
import { ClientsService } from 'src/app/pages/clients/client.service';
import { IEchangeCommercial, IEchangeCommercialModel } from '../../echange-commercial.model';
import { AgendaCommercialListTabs } from './../../../../core/enums/agenda-commercial-list-tabs.enum';
import { EchangeCommercialType } from './../../../../core/enums/echange-commercial-type.enum';
import { ResultStatus } from './../../../../core/enums/result-status';
import { IEchangeCommercialFilterOption } from './../../../../core/models/general/filter-option.model';
import { IPagedResult } from './../../../../core/models/general/result-model';
import { LoadingService } from './../../../../core/services/loading.service';
import { ToastService } from './../../../../core/services/toast.service';
import { TranslationService } from './../../../../core/services/translation.service';
import { BaseContainerComponent } from './../../../../shared/base-features/base-container.component';
import { AgendaCommercialService } from './../../agenda-commercial.service';

@Component({
    selector: 'app-agenda-commercial-shell',
    templateUrl: './agenda-commercial-shell.component.html'
})
export class AgendaCommercialShellComponent extends BaseContainerComponent {

    agendaCommercialListTabs = AgendaCommercialListTabs;
    selectedTabs = AgendaCommercialListTabs.Agenda;
    echangeCommercials: IPagedResult<IEchangeCommercial>;
    echangeCommercial: IEchangeCommercial;

    constructor(
        protected translate: TranslateService,
        protected toastService: ToastService,
        private translationService: TranslationService,
        protected echangeCommercialService: AgendaCommercialService,
        private clientsService: ClientsService,
        private loadingService: LoadingService,
        private fb: FormBuilder,
        public router: Router,
        private route: ActivatedRoute,
        protected location: Location
    ) {
        super(toastService, translate, router, location);
        this.setModule(this.modules.AgendaCommercial);
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
                        if (this.selectedTabs) {
                            this.addEvent();
                        }
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

    //#region form

    /**
     * init Form tache
     */
    initFormTache() {
        this.form = this.fb.group({
            responsableId: [null, [Validators.required]],
            clientId: [null],
            dossierId: [null],
            categorieId: [null],
            typeAppelId: [null],
            titre: [null, [Validators.required]],
            rdvTypeId: [null],
            tacheTypeId: [null],
            description: [null],
            address: [null],
            phoneNumber: [null],
            dateEvent: [null, [Validators.required]],
            time: [null],
            duree: [null],
            sourceRDVId: [null],
            priorite: [null],
            contacts: [null]
        });
    }

    /**
     * init Form rdv
     */
    initFormRDV() {
        this.form = this.fb.group({
            responsableId: [null, [Validators.required]],
            clientId: [null],
            dossierId: [null],
            categorieId: [null],
            typeAppelId: [null],
            titre: [null, [Validators.required]],
            rdvTypeId: [null],
            tacheTypeId: [null],
            description: [null],
            address: [null],
            phoneNumber: [null],
            dateEvent: [null, [Validators.required]],
            time: [null, [Validators.required]],
            duree: [null],
            sourceRDVId: [null],
            priorite: [null],
            contacts: [null]
        });
    }

    /**
     * init Form appel
     */
    initFormAppel() {
        this.form = this.fb.group({
            responsableId: [null, [Validators.required]],
            clientId: [null],
            dossierId: [null],
            categorieId: [null],
            typeAppelId: [null],
            titre: [null, [Validators.required]],
            rdvTypeId: [null],
            tacheTypeId: [null],
            description: [null],
            address: [null],
            phoneNumber: [null],
            dateEvent: [null, [Validators.required]],
            time: [null],
            duree: [null],
            sourceRDVId: [null],
            priorite: [null],
            contacts: [null]
        });
    }

    /**
     * init form
     */
    private initForm(type: EchangeCommercialType) {
        if (type === EchangeCommercialType.Tache) {
            this.initFormTache();
        } else if (type === EchangeCommercialType.RDV) {
            this.initFormRDV();
        } else if (type === EchangeCommercialType.Appel) {
            this.initFormAppel();
        }
    }

    /**
     * setData form
     */
    setDataInForm(echangeCommercial: IEchangeCommercial) {
        this.form.get('responsableId').setValue(echangeCommercial.responsableId);
        this.form.get('clientId').setValue(echangeCommercial.clientId);
        this.form.get('dossierId').setValue(echangeCommercial.dossierId);
        this.form.get('tacheTypeId').setValue(echangeCommercial.tacheTypeId);
        this.form.get('titre').setValue(echangeCommercial.titre);
        this.form.get('categorieId').setValue(echangeCommercial.categorieId);
        this.form.get('rdvTypeId').setValue(echangeCommercial.rdvTypeId);
        this.form.get('description').setValue(echangeCommercial.description);
        this.form.get('dateEvent').setValue(echangeCommercial.dateEvent);
        this.form.get('time').setValue(echangeCommercial.time);
        this.form.get('priorite').setValue(echangeCommercial.priorite);
        this.form.get('duree').setValue(echangeCommercial.duree);
        this.form.get('sourceRDVId').setValue(echangeCommercial.sourceRDVId);
    }

    //#endregion

    //#region service

    /**
     * get list folders as paged
     * @param filter display all folders
     */
    async getEchangeCommercial(filter: IEchangeCommercialFilterOption) {
        this.loading = true;
        this.echangeCommercialService.GetAsPagedResult(filter).subscribe(result => {
            this.loading = false;
            if (result.status === ResultStatus.Succeed) {
                this.echangeCommercials = result;
                this.filterOption = filter;
            } else {
                this.toastErrorServer();
            }
        }, _ => this.loading = false);
    }

    /**
     * get Echange Commercial by id
     */
    async getEchangeCommercialById(id: string, callback: (echange: IEchangeCommercial) => void) {
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        this.echangeCommercialService.Get(id).subscribe(async result => {
            await this.loadingService.hide();
            if (result.status === ResultStatus.Succeed) {
                if (StringHelper.isEmptyOrNull(result.value.dossierId) && !StringHelper.isEmptyOrNull(result.value.clientId)) {
                    this.getClientById(result.value.clientId, (client) => {
                        result.value.client = client;
                        callback(result.value);
                    });
                } else {
                    callback(result.value);
                }
            } else {
                this.toastErrorServer();
            }
        }, async _ => await this.loadingService.hide());
    }

    /** get client by id */
    async getClientById(id: string, callback: (client: IClient) => void) {
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        this.subs.sink = this.clientsService.Get(id).subscribe(async result => {
            await this.loadingService.hide();
            if (result.status === ResultStatus.Succeed) {
                callback(result.value);
            } else {
                this.toastErrorServer();
            }
        }, async _ => {
            await this.loadingService.hide();
        });
    }

    /**
     * Add agenda action
     */
    async addEchangeCommercial(EchangeCommercialModel: IEchangeCommercialModel) {
        EchangeCommercialModel.type = this.getTypeTabs();
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        this.echangeCommercialService.Add(EchangeCommercialModel).subscribe(async result => {
            await this.loadingService.hide();
            if (result.hasValue) {
                this.toastAddSuccess();
                this.cancel();
            } else {
                this.toastErrorServer();
            }
        }, async _ => await this.loadingService.hide());
    }

    /**
     * add memo EchangeCommercial to EchangeCommercial
     * @param memo the memo to add
     */
    async saveMemoEchangeCommercialToEchangeCommercial(memos: Memo[]) {
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        this.echangeCommercialService.SaveMemos(this.echangeCommercial.id, memos)
            .subscribe(async result => {
                await this.loadingService.hide();
                if (result.status === ResultStatus.Succeed) {
                    this.toastSaveSuccess();
                    this.echangeCommercial.memos = memos;
                }
            }, async _ => await this.loadingService.hide());
    }

    /**
     * delete EchangeCommercial
     */
    async deleteEchangeCommercial(id: string) {
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        this.subs.sink = this.echangeCommercialService.Delete(id).subscribe(async result => {
            await this.loadingService.hide();
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.cancel();
            } else {
                this.toastErrorServer();
            }
        }, async _ => await this.loadingService.hide());
    }

    /**
     * add dossier assignation
     */
    updateEchangeCommercialEvent(echangeCommercial: IEchangeCommercial) {
        echangeCommercial.type = this.getTypeTabs();
        echangeCommercial.id = this.echangeCommercial != null ? this.echangeCommercial.id : echangeCommercial.id;
        this.echangeCommercialService.Update(echangeCommercial.id, echangeCommercial)
            .subscribe(result => {
                if (result.hasValue) {
                    this.toastEditSuccess();
                    this.getEchangeCommercial(this.filterOption);
                    this.cancel();
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
        this.echangeCommercial = null;
        this.initForm(this.getTypeTabs());
        this.modeAdd();
    }

    /**
     * show event
     */
    showEvent(id: string) {
        this.getEchangeCommercialById(id, (echangeCommercial) => {
            this.echangeCommercial = echangeCommercial;
            this.setTypeTabs(echangeCommercial.type);
            this.initForm(echangeCommercial.type);
            this.setDataInForm(this.echangeCommercial);
            this.form.disable();
            this.modeShow(id);
        });
    }

    /**
     * edit event
     */
    editEvent(id: string) {
        this.getEchangeCommercialById(id, (echangeCommercial) => {
            this.echangeCommercial = echangeCommercial;
            this.setTypeTabs(echangeCommercial.type);
            this.initForm(echangeCommercial.type);
            this.setDataInForm(this.echangeCommercial);
            this.modeEdit(id);
        });
    }

    // #endregion

    //#region helpers

    /**
     * get type of tabs and synchronize with type backend
     */
    getTypeTabs() {
        switch (this.selectedTabs) {
            case AgendaCommercialListTabs.Tache:
                return EchangeCommercialType.Tache;

            case AgendaCommercialListTabs.Rdv:
                return EchangeCommercialType.RDV;

            case AgendaCommercialListTabs.Appel:
                return EchangeCommercialType.Appel;

            default:
                return this.echangeCommercial.type;
        }
    }

    /**
     * get type of tabs and synchronize with type backend
     */
    setTypeTabs(type: EchangeCommercialType) {
        switch (type) {

            case EchangeCommercialType.RDV:
                this.selectedTabs = AgendaCommercialListTabs.Rdv;
                break;

            case EchangeCommercialType.Appel:
                this.selectedTabs = AgendaCommercialListTabs.Appel;
                break;

            case EchangeCommercialType.Tache:
                this.selectedTabs = AgendaCommercialListTabs.Tache;
                break;

            default:
                this.selectedTabs = AgendaCommercialListTabs.Agenda;
                break;
        }
    }

    public cancel() {
        if (this.isNavigationRoute) {
            this.location.back();
        } else {
            this.getEchangeCommercial(this.filterOption);
            this.modeList();
        }
    }

    //#endregion

}
