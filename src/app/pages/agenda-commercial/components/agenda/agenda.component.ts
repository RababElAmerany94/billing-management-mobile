import { DatePipe, Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { AgendaEvenementType } from 'src/app/core/enums/agenda-evenement-type.enum';
import { EchangeCommercialStatus } from 'src/app/core/enums/echange-commercial-status.enum';
import { EchangeCommercialType } from 'src/app/core/enums/echange-commercial-type.enum';
import { ResultStatus } from 'src/app/core/enums/result-status';
import { SortDirection } from 'src/app/core/enums/sort-direction';
import { DateHelper } from 'src/app/core/helpers/date';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { StringHelper } from 'src/app/core/helpers/string';
import { IEchangeCommercialFilterOption } from 'src/app/core/models/general/filter-option.model';
import { ToastService } from 'src/app/core/services/toast.service';
import { BaseContainerComponent } from 'src/app/shared/base-features/base-container.component';
import { AgendaCommercialService } from '../../agenda-commercial.service';
import { SidebarService } from './../../../../core/services/sidebar.service';

@Component({
    selector: 'app-agenda',
    templateUrl: './agenda.component.html',
    styleUrls: [
        './agenda.component.scss',
        '../../../../../assets/components/lists.scss',
        './../../../../../assets/components/input.scss'
    ],
    providers: [DatePipe]
})
export class AgendaComponent extends BaseContainerComponent implements OnInit {

    @ViewChild(CalendarComponent, null) myCal: CalendarComponent;

    @Output()
    showEvent = new EventEmitter<string>();

    @Output()
    editEvent = new EventEmitter<string>();

    @Output()
    cancelEvent = new EventEmitter<string>();

    /** the choice client */
    @Input()
    clientId: string;

    /** the choice dossier */
    @Input()
    dossierId: string;

    eventSource = [];
    viewTitle: string;
    viewDate: Date = new Date();

    calendar = {
        mode: 'month',
        currentDate: new Date()
    };

    dateFormatter = {
        formatWeekViewHourColumn: (date: Date) => {
            return this.datePipe.transform(date, 'shortTime');
        }
    };

    selectedDate: Date;

    /** filter options */
    filterOption: IEchangeCommercialFilterOption = {
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        OrderBy: 'dateEvent',
        SortDirection: SortDirection.Desc,
        SearchQuery: ''
    };

    /** form group */
    form: FormGroup;

    /** show body filter */
    showButtonEvent = true;

    /** status of echange commercial */
    echangeCommercialStatus = EchangeCommercialStatus;

    /** types events  */
    agendaEvenementTypes = AgendaEvenementType;

    constructor(
        protected translate: TranslateService,
        protected toastService: ToastService,
        private fb: FormBuilder,
        private alertCtrl: AlertController,
        public sidebarService: SidebarService,
        private commercialExchangeService: AgendaCommercialService,
        private datePipe: DatePipe,
        public router: Router,
        protected location: Location
    ) {
        super(toastService, translate, router, location);
        this.initializationForm();
    }

    //#region form

    /**
     * initialization form and detect changes
     */
    initializationForm() {
        this.form = this.fb.group({
            categorieId: [null, []],
            responsableId: [null, []],
            clientId: [null, []],
            search: [null, []],
        });
    }

    //#endregion

    //#region services

    /**
     * get list of commercial exchanges
     */
    getCommercialExchange() {
        if (this.clientId != null) {
            this.filterOption.clientId = this.clientId;
        }
        if (this.dossierId != null) {
            this.filterOption.dossierId = this.dossierId;
        }
        this.commercialExchangeService.GetAsPagedResult(this.filterOption).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.eventSource = result.value.map(item => {

                    const startDate = DateHelper.formatDateTime(item.dateEvent.toString()) as any;
                    const endDate = DateHelper.addTimeToDate(startDate, item.duree);
                    const defaultEndDate = this.defaultEndDate(new Date(item.dateEvent));

                    const event = {
                        title: item.titre,
                        startTime: new Date(item.dateEvent),
                        endTime: !StringHelper.isEmptyOrNull(item.duree) && !item.duree.includes(DateHelper.initTime)
                            ? new Date(endDate)
                            : defaultEndDate,
                        allDay: false,
                        id: item.id,
                        type: item.type,
                        status: item.status,
                        client: item.client != null ? item.client.fullName : '',
                    };
                    return event;
                });
            }
        });
    }

    /**
     * delete EchangeCommercial
     */
    deleteEchangeCommercial(id: string) {
        this.commercialExchangeService.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.refresh();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * sync with google agenda
     */
    synchronize() {
        this.commercialExchangeService.SynchronizationWithGoogleCalendar().subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastSyncSuccess();
            } else {
                this.toastErrorServer();
            }
        });
    }

    //#endregion

    //#region events

    /** search event with filter */
    searchEvent() {
        const values = this.form.value;
        this.filterOption = {
            ...this.filterOption,
            SearchQuery: values.search,
            responsableId: values.responsableId,
            clientId: values.clientId,
            categorieId: values.categorieId
        };
        this.getCommercialExchange();
    }

    // Selected date reange and hence title changed
    onViewTitleChanged(title: string) {
        if (title.includes('Week')) {
            this.viewTitle = title.replace('Week', 'semaine');
        } else {
            this.viewTitle = title;
        }
    }

    // Calendar event was clicked
    onEventSelected(event: any) {
        this.showEvent.emit(event.id);
    }

    // Change current month/week/day
    next() {
        this.myCal.slideNext();
    }

    back() {
        this.myCal.slidePrev();
    }

    /**
     * refresh calendar
     */
    refresh() {
        this.filterOption = {
            Page: 1,
            PageSize: AppSettings.DEFAULT_PAGE_SIZE,
            OrderBy: 'dateEvent',
            SortDirection: SortDirection.Desc,
            SearchQuery: ''
        };
        this.getCommercialExchange();
    }

    editClick(event: any) {
        this.editEvent.emit(event.id);
    }

    showClick(event: any) {
        this.showEvent.emit(event.id);
    }

    deleteClick(event: any) {
        const name = this.getNameType(event.type);
        DialogHelper.presentAlert(
            this.alertCtrl,
            this.translate,
            {
                headerText: this.translate.instant(`${name}.DELETE.HEADER`),
                message: this.translate.instant(`${name}.DELETE.MESSAGE`),
                done: async () => {
                    this.deleteEchangeCommercial(event.id);
                },
                cancel: () => { }
            }
        );
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

    onRangeChanged(event: { startTime: Date, endTime: Date; }) {
        this.filterOption = {
            ...this.filterOption,
            dateFrom: DateHelper.formatDate(event.startTime.toString()) as any,
            dateTo: DateHelper.formatDate(event.endTime.toString()) as any,
        };
        this.getCommercialExchange();
    }

    getStatus(status: EchangeCommercialStatus) {
        return `ECHANGE_COMMERCIAL_STATUS.${status}`;
    }

    defaultEndDate(date: Date) {
        date.setHours(23, 59);
        return date;
    }

    //#endregion
}
