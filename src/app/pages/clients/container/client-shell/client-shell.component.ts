import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ClientType } from 'src/app/core/enums/client-type.enum';
import { ModeEnum } from 'src/app/core/enums/mode.enum';
import { ResultStatus } from 'src/app/core/enums/result-status';
import { RouteName } from 'src/app/core/enums/route.enum';
import { ClientHelper } from 'src/app/core/helpers/client';
import { ConversionHelper } from 'src/app/core/helpers/conversion';
import { StringHelper } from 'src/app/core/helpers/string';
import { IDropDownItem } from 'src/app/core/models/general/drop-down-item.model';
import { IClientFilterOption } from 'src/app/core/models/general/filter-option.model';
import { Memo } from 'src/app/core/models/general/memo.model';
import { IPagedResult } from 'src/app/core/models/general/result-model';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ToastService, ToastTypes } from 'src/app/core/services/toast.service';
import { TranslationService } from 'src/app/core/services/translation.service';
import { BaseContainerComponent } from 'src/app/shared/base-features/base-container.component';
import { ClientShared } from '../../client-shared';
import { IClient, IClientModel } from '../../client.model';
import { ClientsService } from '../../client.service';

@Component({
    selector: 'app-client-shell',
    templateUrl: './client-shell.component.html',
})
export class ClientShellComponent extends BaseContainerComponent implements OnInit {

    /** client list */
    clients: IPagedResult<IClient>;

    /** the current client to modify */
    client: IClient;

    /** client type */
    clientType: IDropDownItem<number, string>[] = [];

    /** the enum client tabs types */
    clientTypeTabs = ClientType;

    /** selected tabs */
    selectedTabs = ClientType.Particulier;

    constructor(
        private translationService: TranslationService,
        private clientsService: ClientsService,
        protected toastService: ToastService,
        protected translate: TranslateService,
        private loadingService: LoadingService,
        private fb: FormBuilder,
        public router: Router,
        private route: ActivatedRoute,
        protected location: Location,
    ) {
        super(toastService, translate, router, location);
        this.setModule(this.modules.Clients);
        this.translationService.setLanguage(this.translate);
        this.subscribeRouteChanges();
    }

    //#region route

    /**
     * subscribe route changes
     */
    subscribeRouteChanges() {
        this.route.queryParams.subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result.mode)) {
                this.isNavigationRoute = result.isNavigationRoute;
                const mode = parseInt(result.mode, 10) as ModeEnum;
                switch (mode) {
                    case ModeEnum.List:
                        this.modeList();
                        break;

                    case ModeEnum.Add:
                        this.addEvent();
                        break;

                    case ModeEnum.Edit:
                        this.editEvent(result.id);
                        break;

                    case ModeEnum.Show:
                        this.showEvent(result.id);
                        break;
                }
            }
        });
    }

    //#endregion

    //#region form

    /**
     * init client form
     */
    initForm() {
        this.form = ClientShared.createForm(this.fb);
    }

    /**
     * set client form
     */
    setClientForm(client: IClient) {
        this.form.get('reference').setValue(client.reference);
        this.form.get('firstName').setValue(client.firstName);
        this.form.get('lastName').setValue(client.lastName);
        this.form.get('phoneNumber').setValue(client.phoneNumber);
        this.form.get('email').setValue(client.email);
        this.form.get('webSite').setValue(client.webSite);
        this.form.get('siret').setValue(client.siret);
        this.form.get('genre').setValue(client.genre);
        this.form.get('codeComptable').setValue(client.codeComptable);
        this.form.get('regulationModeId').setValue(client.regulationModeId);
        this.form.get('type').setValue(client.type);
        this.form.get('commercialId').setValue(client.commercialId);
        this.form.get('noteDevis').setValue(client.noteDevis);
        this.form.get('agenceId').setValue(client.agenceId);
        this.form.get('dateReceptionLead').setValue(client.dateReceptionLead);
        this.form.get('logementTypeId').setValue(client.logementTypeId);
        this.form.get('sourceLead').setValue(client.sourceLead);
        this.form.get('typeChauffageId').setValue(client.typeChauffageId);
        this.form.get('parcelleCadastrale').setValue(client.parcelleCadastrale);
        this.form.get('surfaceTraiter').setValue(client.surfaceTraiter);
        this.form.get('precarite').setValue(client.precarite);
        this.form.get('nombrePersonne').setValue(client.nombrePersonne);
        this.form.get('isMaisonDePlusDeDeuxAns').setValue(client.isMaisonDePlusDeDeuxAns);
        this.form.get('revenueFiscaleReference').setValue(client.revenueFiscaleReference);
        this.form.get('numeroDHA').setValue(client.numeroDHA);
        this.form.get('isSousTraitant').setValue(client.isSousTraitant);
        this.form.get('typeTravaux').setValue(client.typeTravaux);
        if (client.primeCEE != null) {
            this.form.get('primeCEEId').setValue(client.primeCEE.fullName);
        } else {
            this.form.get('primeCEEId').setValue('');
        }
        this.form.get('labelPrimeCEE').setValue(client.labelPrimeCEE);
    }

    //#endregion

    async ngOnInit() {
        this.chargeDropDownClientType();
    }

    //#region services

    /**
     * check phone is unique
     * @param item the phone number
     */
    checkPhoneIsUnique(item: IClientModel, callback) {
        this.subs.sink = this.clientsService.GetAsPagedResult(this.filterOption).subscribe((result) => {
            if (result.status === ResultStatus.Succeed) {
                const value = result.value.filter(x => x.reference !== item.reference && x.phoneNumber === item.phoneNumber);
                if (value.length > 0) {
                    callback(false);
                    this.toastService.presentToast({ message: this.translate.instant('ERRORS.PHONE_NOT_UNIQUE'), type: ToastTypes.Danger });
                } else {
                    callback(true);
                }
                return;
            }
            callback(true);
        });
    }

    /**
     * get list client paged
     * @param filter display all client
     */
    getClients(filter: IClientFilterOption) {
        this.loading = true;
        this.clientsService.GetAsPagedResult(filter).subscribe(result => {
            this.loading = false;
            if (result.status === ResultStatus.Succeed) {
                this.clients = result;
                this.filterOption = filter;
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * delete client
     */
    async deleteClient(id: string) {
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        this.subs.sink = this.clientsService.Delete(id).subscribe(async result => {
            await this.loadingService.hide();
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.cancel();
            } else {
                await this.toastErrorServer();
            }
        });
    }

    /**
     * edit client
     */
    async editClient(clientModel: IClientModel) {
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        ClientHelper.CheckReferenceIsUnique(this.clientsService, this.toastService, clientModel, this.translate, this.client, false,
            async (checkResult: boolean) => {
                if (checkResult) {
                    await this.loadingService.hide();
                    this.checkPhoneIsUnique(clientModel, (checkResultPhone: boolean) => {
                        if (checkResultPhone) {
                            this.clientsService.Update(this.client.id, clientModel).subscribe(async result => {
                                if (result.hasValue) {
                                    this.toastEditSuccess();
                                    this.cancel();
                                } else {
                                    this.toastErrorServer();
                                }
                            });
                        }
                    });
                }
            });
    }

    /**
     * Add client action
     */
    async addClient(clientModel: IClientModel) {
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        ClientHelper.CheckReferenceIsUnique(this.clientsService, this.toastService, clientModel, this.translate, null, true,
            async (checkResult: boolean) => {
                if (checkResult) {
                    await this.loadingService.hide();
                    this.checkPhoneIsUnique(clientModel, (checkResultPhone: boolean) => {
                        if (checkResultPhone) {
                            this.clientsService.Add(clientModel).subscribe(async result => {
                                if (result.hasValue) {
                                    this.toastAddSuccess();
                                    this.cancel();
                                } else {
                                    this.toastErrorServer();
                                }
                            });
                        }
                    });
                }
            });
    }

    async getClientById(id: string, callback: (result: IClient) => void) {
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
     * add memo to client
     * @param memo the memo to add
     */
    saveMemoToClient(memos: Memo[]) {
        this.subs.sink = this.clientsService.SaveMemos(this.client.id, memos ).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastSaveSuccess();
                this.client.memos = memos;
            }
        });
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

    //#region events

    /**
     * add event
     */
    async addEvent() {
        this.client = null;
        this.initForm();
        this.modeAdd();
    }

    /**
     * show event
     */
    async showEvent(id: string) {
        this.getClientById(id, (result) => {
            this.initForm();
            this.client = result;
            this.setClientForm(this.client);
            this.form.disable();
            this.modeShow(id);
        });
    }

    /**
     * edit event
     */
    editEvent(id: string) {
        this.getClientById(id, (result) => {
            this.initForm();
            this.client = result;
            this.setClientForm(this.client);
            this.modeEdit(id);
        });
    }

    //#endregion

    //#region helper

    /** charge dropdown civilite */
    chargeDropDownClientType() {
        this.clientType = ConversionHelper.convertEnumToListKeysValues(ClientType, 'number');
        this.clientType.forEach(e => e.text = `CLIENT_TYPE.${e.value}`);
    }

    public cancel() {
        if (this.isNavigationRoute) {
            this.location.back();
        } else {
            this.getClients(this.filterOption);
            this.modeList();
        }
    }

    //#endregion

}
