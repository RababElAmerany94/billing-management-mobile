import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastService } from 'src/app/core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { IAgence } from 'src/app/core/models/agence/agence.model';
import { IFilterOption } from 'src/app/core/models/general/filter-option.model';
import { ResultStatus } from 'src/app/core/enums/result-status';
import { AgenceService } from 'src/app/core/services/agence-service/agence.service';
import { BaseListComponent } from '../../base-features/base-list.component';
import { IPagedResult } from 'src/app/core/models/general/result-model';

@Component({
    selector: 'app-select-agences',
    templateUrl: './select-agences.component.html',
    styleUrls: [
        '../../../../assets/components/lists.scss'
    ],
})
export class SelectAgencesComponent extends BaseListComponent<IAgence, number>  {

    agences: IAgence[] = [];
    agencesAsPage: IPagedResult<IAgence>;
    selectedAgenceId: string;

    constructor(
        private agenceService: AgenceService,
        private toastService: ToastService,
        public modalController: ModalController,
        private translate: TranslateService) {
        super();
    }

    //#region services

    getAgence(filterOption: IFilterOption) {
        this.loading = true;
        this.subs.sink = this.agenceService.GetAsPagedResult(filterOption)
            .subscribe(result => {
                this.loading = false;
                if (result.status === ResultStatus.Succeed) {
                    this.agencesAsPage = result;
                    if (this.agencesAsPage.currentPage === 1) {
                        this.agences = [];
                    }
                    this.agences = [...this.agences, ...result.value];
                } else {
                    this.toastService.presentToast({ message: this.translate.instant('ERRORS.SERVER') });
                }
            });
    }

    //#endregion services

    //#region helpers

    async chooseAgence() {
        const agence = this.agences.find(e => e.id === this.selectedAgenceId);
        await this.modalController.dismiss(agence);
    }

    selectAgence(id: string) {
        this.selectedAgenceId = id;
    }

    //#endregion
}
