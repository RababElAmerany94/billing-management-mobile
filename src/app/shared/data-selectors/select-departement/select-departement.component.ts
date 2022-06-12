import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { ResultStatus } from 'src/app/core/enums/result-status';
import { SortDirection } from 'src/app/core/enums/sort-direction';
import { Departement } from 'src/app/core/models/general/departement.model';
import { IDepartmentFilterOption } from 'src/app/core/models/general/filter-option.model';
import { IPagedResult } from 'src/app/core/models/general/result-model';
import { DepartementService } from 'src/app/core/services/departement-service/departement.service';
import { ToastService, ToastTypes } from 'src/app/core/services/toast.service';
import { StringHelper } from '../../../core/helpers/string';
import { BaseListComponent } from '../../base-features/base-list.component';

@Component({
    selector: 'app-select-departement',
    templateUrl: './select-departement.component.html',
    styleUrls: [
        '../../../../assets/components/lists.scss',
        './../../table-article/select-article/select-article.component.scss'],
})
export class SelectDepartementComponent extends BaseListComponent<Departement, number>  {

    title = 'DATA_SELECTOR.SELECT_DEPARTEMENT';

    /** the list of departments as page result */
    departmentsAsPaged: IPagedResult<Departement>;

    /** the list of departments as page result */
    departments: Departement[] = [];

    /** selected departement */
    departement: Departement;

    /** the filter option */
    filterOption: IDepartmentFilterOption = {
        SearchQuery: '',
        OrderBy: 'departementNom',
        SortDirection: SortDirection.Asc,
        Page: 1,
        PageSize: AppSettings.MAX_GET_DATA
    };

    constructor(
        private toastService: ToastService,
        private departmentService: DepartementService,
        public modalController: ModalController,
        private navParams: NavParams,
        private translate: TranslateService) {
        super();
        this.filterOption.countryId = this.navParams.get('countryId');
        this.getListDepartments(this.filterOption);
    }

    //#region services

    /** list of departments */
    getListDepartments(filterOption: IDepartmentFilterOption) {
        this.departmentService.GetAsPagedResult(filterOption)
            .subscribe(result => {
                this.loading = false;
                if (result.status === ResultStatus.Succeed) {
                    this.departmentsAsPaged = result;

                    if (this.departmentsAsPaged.currentPage === 1) {
                        this.departments = [];
                    }
                    this.departments = [...this.departments, ...this.departmentsAsPaged.value];
                } else {
                    this.toastService.presentToast({ message: this.translate.instant('ERRORS.SERVER'), type: ToastTypes.Warning });
                }
            });
    }

    //#endregion services

    //#region helper

    /** choose departement data */
    async chooseDepartment() {
        await this.modalController.dismiss(this.departement);
    }

    select(departementNom: string) {
        this.departement = this.departments.find(e => e.departementNom === departementNom);
    }

    /**
     * search departement
     * @param text the text to search
     */
    searchEvent(filterOption: IDepartmentFilterOption) {
        if (!StringHelper.isEmptyOrNull(filterOption.SearchQuery)) {
            this.departmentsAsPaged.value = this.departments
                .filter(e => e.departementNom.toLowerCase().includes(filterOption.SearchQuery.toLowerCase()));
        } else {
            this.departmentsAsPaged.value = this.departments;
        }
    }

    //#endregion
}
