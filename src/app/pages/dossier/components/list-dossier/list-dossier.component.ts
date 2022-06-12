import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { IPagedResult } from 'src/app/core/models/general/result-model';
import { IDossier, IDossierDataList, DossierAssignationModel } from '../../dossier.model';
import { BaseListComponent } from 'src/app/shared/base-features/base-list.component';
import { DossierStatus } from 'src/app/core/enums/dossier-status.enums';
import { TypeTravaux } from '../../../../core/enums/type-travaux.enum';
import { Address } from '../../../../core/models/general/address.model';
import { JsonHelper } from '../../../../core/helpers/json';
import { DossierHelper } from '../../../../core/helpers/dossier';
import { StringHelper } from '../../../../core/helpers/string';
import { AssignCommercialComponent } from '../assign-commercial/assign-commercial.component';
import { DossierListTabs } from '../../../../core/enums/dossier-list-tabs.enum';
import { AppSettings } from '../../../../app-settings/app-settings';
import { SortDirection } from '../../../../core/enums/sort-direction';
import { IDossierFilterOption, IFilterOption } from '../../../../core/models/general/filter-option.model';

@Component({
    selector: 'app-list-dossier',
    templateUrl: './list-dossier.component.html',
    styleUrls: ['../../../../../assets/components/lists.scss'],
})
export class ListDossierComponent extends BaseListComponent<IDossier, number> {

    @Output()
    addDevisEvent = new EventEmitter<IDossierDataList>();

    @Output()
    dossierAssignationEvent = new EventEmitter<DossierAssignationModel>();

    @Output()
    syncAntsrouteEvent = new EventEmitter();

    @Output()
    markDossierAplanifierEvent = new EventEmitter();

    @Input()
    set data(values: IPagedResult<IDossier>) {
        if (values != null) {
            this.DossierAsPage = { ...values as IPagedResult<any> };
            this.dossiers = values.value.map<IDossierDataList>(e => this.mapIDossierIntoIDossierDataList(e));
        }
    }

    @Input()
    set tabType(value: DossierListTabs) {
        if (value != null) {
            this.type = value;
            this.initializeFilter();
        }
    }

    /** list dossiers */
    dossiers: IDossierDataList[];

    /** the list of dossier as page result */
    DossierAsPage: IPagedResult<IDossier>;

    /** status of dossier */
    dossierStatus = DossierStatus;

    /** the site intervention */
    siteIntervention: Address[];

    /** the filter option */
    filterOptions: IDossierFilterOption = {
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        OrderBy: 'id',
        SortDirection: SortDirection.Desc,
        SearchQuery: '',
    };

    /** the selected tabs */
    type: DossierListTabs;

    constructor(
        public translate: TranslateService,
        public modalController: ModalController,
        private alertController: AlertController,
        public navCtrl: NavController,
    ) {
        super();
        this.setModule(this.modules.Dossiers);
    }

    /** initialize filter component */
    initializeFilter() {
        switch (this.type) {

            case DossierListTabs.AReplanifier:
                this.filterOptions.status = DossierStatus.EnRetard;
                break;

            case DossierListTabs.AValider:
                this.filterOptions.status = DossierStatus.EnAttente;
                break;

            case DossierListTabs.AVenir:
                this.filterOptions.status = DossierStatus.Assigne;
                const today = new Date();
                const tomorrow = new Date(today.setDate(today.getDate() + 1));
                this.filterOptions.dateRdvFrom = tomorrow;
                break;
        }
    }

    /**
     * mapping dossier to dossier dataTables
     * @param dossier the dossier information
     */
    mapIDossierIntoIDossierDataList(dossier: IDossier): IDossierDataList {
        const address = dossier.siteIntervention as Address;
        const dossierDataList: IDossierDataList = {
            id: dossier.id,
            reference: dossier.reference,
            client: dossier.client.fullName,
            clientId: dossier.clientId,
            dateRDV: dossier.dateRDV,
            primeCEEId: dossier.primeCEEId,
            commercialId: dossier.commercialId,
            dateCreation: dossier.dateCreation,
            siteIntervention: address != null ? dossier.siteIntervention : null,
            addresse: address != null ? address.adresse : '',
            status: dossier.status,
            typeTravaux: dossier.typeTravaux,
        };

        return dossierDataList;
    }

    //#region events

    /**
     * delete click
     */
    deleteClick(id: string) {
        const dossier = this.dossiers[id];
        DialogHelper.presentAlert(
            this.alertController,
            this.translate,
            {
                headerText: this.translate.instant('LIST.DELETE.HEADER'),
                message: this.translate.instant('LIST.DELETE.MESSAGE') + ':' + dossier.reference.toUpperCase() + ' ? ',
                done: async () => {
                    this.deleteEvent.emit(dossier.id);
                },
                cancel: () => null
            }
        );
    }

    /**
     * sync dossier with anstroute
     */
    syncAntsroute(id: string) {
        this.syncAntsrouteEvent.emit(id);
    }

    MarkDossierAplanifier(id: string) {
        this.markDossierAplanifierEvent.emit(id);
    }

    /**
     * add Devis associate with dossier
     */
    addDevis(dossier: IDossierDataList) {
        this.addDevisEvent.emit(dossier);
    }

    /**
     * assigner dossier to commercial
     */
    async assignerDossier(doss: IDossierDataList) {
        const data = {
            commercialId: doss.commercialId,
            dateRDV: doss.dateRDV,
            dossierId: doss.id,
        };
        DialogHelper.openDialog(this.modalController,
            AssignCommercialComponent, data).then(result => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    const dossierAssignee: DossierAssignationModel = {
                        ...result,
                        status: doss.status,
                        dossierId: doss.id
                    };
                    this.dossierAssignationEvent.emit(dossierAssignee);
                } else {
                    return null;
                }
            });
    }

    //#endregion

    //#region helper

    getStatus(status: DossierStatus) {
        return `STATUS_DOSSIER.${status}`;
    }

    getTypeTravaux(type: TypeTravaux) {
        return `TYPE_TRAVAUX.${type}`;
    }

    /**
     * can dossier be assigne
     */
    canAssigne(status: DossierStatus) {
        return DossierHelper.canAssigne(status);
    }

    /**
     * can dossier be async
     */
    canSyncAntsroute = (status) => status === DossierStatus.APlanifie;

    /**
     * can Mark Dossier A planifier
     */
    canMarkDossierAplanifier = (status) => status === DossierStatus.Signe;

    changeFiltersEvent(dataTableOutput: IFilterOption) {
        this.filterOption = { ...this.filterOptions, ...dataTableOutput };
        this.filters.emit(this.filterOption);
    }

    //#endregion
}
