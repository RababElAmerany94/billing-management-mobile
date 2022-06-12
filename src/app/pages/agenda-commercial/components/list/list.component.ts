import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EchangeCommercialStatus } from 'src/app/core/enums/echange-commercial-status.enum';
import { ArrayHelper } from 'src/app/core/helpers/array';
import { Address } from 'src/app/core/models/general/address.model';
import { IContact } from 'src/app/core/models/general/contacts.model';
import { AgendaCommercialHelper } from '../../agenda-commercial-helper';
import { DateHelper } from 'src/app/core/helpers/date';
import { DialogHelper } from './../../../../core/helpers/dialog';
import { IPagedResult } from './../../../../core/models/general/result-model';
import { BaseListComponent } from './../../../../shared/base-features/base-list.component';
import { IEchangeCommercial, IEchangeCommercialList } from '../../echange-commercial.model';
import { EchangeCommercialType } from './../../../../core/enums/echange-commercial-type.enum';
import { IEchangeCommercialFilterOption, IFilterOption } from './../../../../core/models/general/filter-option.model';
import { SortDirection } from './../../../../core/enums/sort-direction';
import { AppSettings } from './../../../../app-settings/app-settings';
import { AgendaCommercialListTabs } from './../../../../core/enums/agenda-commercial-list-tabs.enum';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['../../../../../assets/components/lists.scss'],
})
export class ListComponent extends BaseListComponent<IEchangeCommercial, string> {

    @Output()
    cancelEvent = new EventEmitter<IEchangeCommercial>();

    @Output()
    cloturerEvent = new EventEmitter<IEchangeCommercial>();

    @Input()
    set data(values: IPagedResult<IEchangeCommercial>) {
        if (values != null) {
            this.echangeCommercialsAsPage = { ...values as IPagedResult<any> };

            if (this.echangeCommercialsAsPage.currentPage === 1) {
                this.echangeCommercial = [];
                this.echangeCommercialList = [];
                this.echangeCommercialToday = [];
                this.echangeCommercialTomorrow = [];
                this.echangeCommercialAVenir = [];
                this.echangeCommercialOther = [];
            }

            this.echangeCommercial = values.value;
            this.echangeCommercialList = values.value
                .map<IEchangeCommercialList>(e => this.mapIEchangeCommercialIntoIEchangeCommercialList(e));
            this.echangeCommercialToday = this.echangeCommercialList.filter(x => DateHelper.compareDateToday(x.dateEvent));
            this.echangeCommercialTomorrow = this.echangeCommercialList.filter(x => DateHelper.compareDateTomorrow(x.dateEvent));
            this.echangeCommercialAVenir = this.echangeCommercialList.filter(x => DateHelper.compareDateToComeUp(x.dateEvent));
            this.echangeCommercialOther = this.echangeCommercialList.filter(x =>
                !this.echangeCommercialToday.find(e => e.id === x.id) &&
                !this.echangeCommercialTomorrow.find(e => e.id === x.id) &&
                !this.echangeCommercialAVenir.find(e => e.id === x.id)
            );
        }
    }

    @Input()
    set tabType(value: AgendaCommercialListTabs) {
        if (value != null) {
            this.type = value;
            this.title = this.getTitles();
            this.initializeFilter();
        }
    }

    /** list EchangeCommercial */
    echangeCommercial: IEchangeCommercial[];

    echangeCommercialList: IEchangeCommercialList[];
    echangeCommercialToday: IEchangeCommercialList[];
    echangeCommercialTomorrow: IEchangeCommercialList[];
    echangeCommercialAVenir: IEchangeCommercialList[];
    echangeCommercialOther: IEchangeCommercialList[];

    /** the list of EchangeCommercial as page result */
    echangeCommercialsAsPage: IPagedResult<IEchangeCommercial>;

    /** status of echangeCommercial */
    echangeCommercialStatus = EchangeCommercialStatus;

    type: AgendaCommercialListTabs;

    title: string;

    /** filter options */
    filterOptions: IEchangeCommercialFilterOption = {
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        OrderBy: 'dateEvent',
        SortDirection: SortDirection.Desc,
        SearchQuery: ''
    };

    constructor(
        public translate: TranslateService,
        private alertController: AlertController
    ) {
        super();
        this.setModule(this.modules.AgendaCommercial);
    }

    /** initialize filter component */
    initializeFilter() {
        switch (this.type) {

            case AgendaCommercialListTabs.Appel:
                this.filterOptions.type = EchangeCommercialType.Appel;
                break;

            case AgendaCommercialListTabs.Tache:
                this.filterOptions.type = EchangeCommercialType.Tache;
                break;

            case AgendaCommercialListTabs.Rdv:
                this.filterOptions.type = EchangeCommercialType.RDV;
                break;
        }
    }

    /**
     * mapping echange commercial to echange commercial dataTables
     * @param echangeCommercial the echange commercial information
     */
    mapIEchangeCommercialIntoIEchangeCommercialList(echangeCommercial: IEchangeCommercial): IEchangeCommercialList {
        const addresses = echangeCommercial.addresses as Address[];
        const contacts = echangeCommercial.contacts as IContact[];
        const echangeCommercialDataList: IEchangeCommercialList = {
            id: echangeCommercial.id,
            clientId: echangeCommercial.client ? echangeCommercial.client.fullName : '',
            dateEvent: echangeCommercial.dateEvent,
            responsableId: echangeCommercial.responsable ? echangeCommercial.responsable.fullName : '',
            adresse: !ArrayHelper.isEmptyOrNull(addresses) && addresses.length > 0 ?
                `${addresses[0].ville} ${addresses[0].codePostal}` : '',
            contact: !ArrayHelper.isEmptyOrNull(contacts) && contacts.length > 0 ?
                `${contacts[0].nom} ${contacts[0].prenom} ${contacts[0].mobile}` : '',
            status: echangeCommercial.status,
            titre: echangeCommercial.titre,
            phoneNumber: echangeCommercial.phoneNumber,
            description: echangeCommercial.description,
        };

        return echangeCommercialDataList;
    }

    //#region events

    /**
     * delete click
     */
    deleteClick(id: string) {
        const name = this.getNameType(this.type);
        const echangeCommercial = this.echangeCommercial.find(x => x.id === id);
        DialogHelper.presentAlert(
            this.alertController,
            this.translate,
            {
                headerText: this.translate.instant(`${name}.DELETE.HEADER`),
                message: this.translate.instant(`${name}.DELETE.MESSAGE`) + ':' + echangeCommercial.titre + ' ? ',
                done: async () => {
                    this.deleteEvent.emit(echangeCommercial.id);
                },
                cancel: () => null
            }
        );
    }

    /**
     * cloture click
     */
    clotureClick(id: string) {
        const echangeCommercial = this.echangeCommercial.find(x => x.id === id);
        echangeCommercial.status = EchangeCommercialStatus.cloturee;
        this.cloturerEvent.emit(echangeCommercial);
    }


    /**
     * cancel click
     */
    cancelClick(id: string) {
        const echangeCommercial = this.echangeCommercial.find(x => x.id === id);
        echangeCommercial.status = EchangeCommercialStatus.annulee;
        this.cancelEvent.emit(echangeCommercial);
    }

    //#endregion

    //#region helper

    getStatus(status: EchangeCommercialStatus) {
        return `ECHANGE_COMMERCIAL_STATUS.${status}`;
    }

    changeFiltersEvent(dataTableOutput: IFilterOption) {
        this.filterOption = {
            ...this.filterOptions,
            ...dataTableOutput,
            OrderBy: 'dateEvent'
        };
        this.filters.emit(this.filterOption);
    }

    /**
     * title of pop up
     */
    getTitles() {
        switch (this.type) {
            case AgendaCommercialListTabs.Appel:
                return 'APPELS.LIST_TITLE';

            case AgendaCommercialListTabs.Rdv:
                return 'RENDEZ-VOUS.LIST_TITLE';

            case AgendaCommercialListTabs.Tache:
                return 'TACHE.LIST_TITLE';
        }
    }

    /**
     * name of pop up
     */
    getNameType(type: AgendaCommercialListTabs) {
        switch (type) {
            case AgendaCommercialListTabs.Appel:
                return 'APPELS';

            case AgendaCommercialListTabs.Rdv:
                return 'RENDEZ-VOUS';

            case AgendaCommercialListTabs.Tache:
                return 'TACHE';
        }
    }

    canCloture = (status: EchangeCommercialStatus) => !AgendaCommercialHelper.isStatusCloture(status);
    canCancel = (status: EchangeCommercialStatus) => !AgendaCommercialHelper.isStatusAnnulee(status);

    //#endregion

}
