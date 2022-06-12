import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { PeriodeFilter } from 'src/app/core/enums/period-filter.enum';
import { ResultStatus } from 'src/app/core/enums/result-status';
import { SortDirection } from 'src/app/core/enums/sort-direction';
import { ConversionHelper } from 'src/app/core/helpers/conversion';
import { DateHelper } from 'src/app/core/helpers/date';
import { StringHelper } from 'src/app/core/helpers/string';
import { IDropDownItem } from 'src/app/core/models/general/drop-down-item.model';
import {
    IAdvanceDashboardFilterOption,
    IDossierFilterOption,
    IEchangeCommercialFilterOption,
    IFilterOption
} from 'src/app/core/models/general/filter-option.model';
import { IPagedResult } from 'src/app/core/models/general/result-model';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { TranslationService } from 'src/app/core/services/translation.service';
import { AgendaCommercialService } from 'src/app/pages/agenda-commercial/agenda-commercial.service';
import { IEchangeCommercial } from 'src/app/pages/agenda-commercial/echange-commercial.model';
import { IDossier } from 'src/app/pages/dossier/dossier.model';
import { DossierService } from 'src/app/pages/dossier/dossier.service';
import { IChartData, IRepartitionDossiersTechnicien, IRepartitionTypesTravauxParTechnicien } from '../../dashboard.model';
import { DashboardService } from '../../dashboard.service';
import { BaseContainerComponent } from './../../../../shared/base-features/base-container.component';
import { Location } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./../../../../../assets/components/input.scss']
})
export class DashboardPage extends BaseContainerComponent {

    showInterval = true;
    periods: IDropDownItem<number, string>[] = [];

    chiffreAffaireStatistics: IChartData;
    dossiers: IPagedResult<IDossier>;
    echangeCommercial: IPagedResult<IEchangeCommercial>;
    repartitionDossiersTechnicien: IRepartitionDossiersTechnicien[] = [];
    repartitionTypesTravauxParTechnicien: IRepartitionTypesTravauxParTechnicien[];

    filterOption: IFilterOption = {
        OrderBy: 'createOn',
        SortDirection: SortDirection.Desc,
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        SearchQuery: ''
    };

    echangeCommercialFilterOption: IEchangeCommercialFilterOption = {
        ...this.filterOption,
    };

    dossierFilterOption: IDossierFilterOption = {
        ...this.filterOption,
    };

    dashboardFilterOption: IAdvanceDashboardFilterOption = {
        period: PeriodeFilter.All,
        dateTo: DateHelper.formatDateTime(DateHelper.getLastDayInTheCurrentYear()),
        dateFrom: DateHelper.formatDateTime(DateHelper.getFirstDayInTheCurrentYear())
    };

    constructor(
        protected translate: TranslateService,
        private translateService: TranslationService,
        protected toastService: ToastService,
        protected agendaCommercialService: AgendaCommercialService,
        private loadingService: LoadingService,
        private dashboardService: DashboardService,
        protected dossierService: DossierService,
        private fb: FormBuilder,
        public router: Router,
        protected location: Location
    ) {
        super(toastService, translate, router, location);
        this.setModule(this.modules.Home);
        this.translateService.setLanguage(this.translate);
        this.chargePeriods();
        this.initializeForm();
        this.initDataComponent();
    }

    //#region form filter

    initializeForm() {
        this.form = this.fb.group({
            agenceId: [null],
            commercialId: [null],
            dateFrom: [DateHelper.getFirstDayInTheCurrentYear()],
            dateTo: [DateHelper.getLastDayInTheCurrentYear()],
            period: [PeriodeFilter.Interval],
        });
        this.form.controls.period.valueChanges.subscribe(value => {
            if (value === PeriodeFilter.Interval) {
                this.showInterval = true;
            } else {
                this.showInterval = false;
            }
        });
    }

    /** init data component */
    initDataComponent() {
        this.getDossiers();
        this.getEchangeCommercial();
        this.getChiffreAffaire();
        this.GetRepartitionDossiersTechnicien();
        this.GetRepartitionTypesTravauxParTechnicien();
    }

    //#endregion

    /**
     * period enum
     */
    chargePeriods() {
        this.periods = ConversionHelper.convertEnumToListKeysValues(PeriodeFilter, 'number');
        this.periods.forEach(e => e.text = `PERIOD_COMPTABLE.${e.value}`);
    }

    /**
     * click button search
     */
    async searchEvent() {
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));

        const values = this.form.value;

        const dateFrom = !StringHelper.isEmptyOrNull(values.dateFrom) ? DateHelper.formatDate(values.dateFrom) : null;
        const dateTo = !StringHelper.isEmptyOrNull(values.dateTo) ? DateHelper.formatDate(values.dateTo) : null;

        this.dashboardFilterOption = {
            userId: values.commercialId,
            period: values.period,
            agenceId: values.agenceId,
            dateFrom,
            dateTo
        };

        this.echangeCommercialFilterOption = {
            ...this.filterOption,
            responsableId: values.commercialId,
            dateFrom: dateFrom as any,
            dateTo: dateTo as any
        };

        this.dossierFilterOption = {
            ...this.filterOption,
        };

        this.initDataComponent();
    }

    //#region services

    /**
     * get chiffre affaire
     */
    getChiffreAffaire() {
        this.subs.sink = this.dashboardService.GetChiffreAffaire(this.dashboardFilterOption)
            .subscribe(result => {
                this.loadingService.hide();
                if (result.status === ResultStatus.Succeed) {
                    this.chiffreAffaireStatistics = result.value;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * get dossiers as paged
     */
    getDossiers() {
        this.dossierService.GetAsPagedResult(this.dossierFilterOption)
            .subscribe(result => {
                this.loadingService.hide();
                if (result.status === ResultStatus.Succeed) {
                    this.dossiers = result;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * get notifications as paged
     */
    getEchangeCommercial() {
        this.agendaCommercialService.GetAsPagedResult(this.echangeCommercialFilterOption)
            .subscribe(result => {
                this.loadingService.hide();
                if (result.status === ResultStatus.Succeed) {
                    this.echangeCommercial = result;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    GetRepartitionDossiersTechnicien() {
        this.dashboardService.GetRepartitionDossiersTechnicien(this.dashboardFilterOption).subscribe(result => {
            this.loadingService.hide();
            if (result.status === ResultStatus.Succeed) {
                this.repartitionDossiersTechnicien = result.value;
            } else {
                this.toastErrorServer();
            }
        });
    }

    GetRepartitionTypesTravauxParTechnicien() {
        this.dashboardService.GetRepartitionTypesTravauxParTechnicien(this.dashboardFilterOption).subscribe(result => {
            this.loadingService.hide();
            if (result.status === ResultStatus.Succeed) {
                this.repartitionTypesTravauxParTechnicien = result.value;
            } else {
                this.toastErrorServer();
            }
        });
    }

    //#endregion

}
