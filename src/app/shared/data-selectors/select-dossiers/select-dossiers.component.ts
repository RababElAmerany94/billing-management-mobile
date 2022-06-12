import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ResultStatus } from 'src/app/core/enums/result-status';
import { IFilterOption } from 'src/app/core/models/general/filter-option.model';
import { IPagedResult } from 'src/app/core/models/general/result-model';
import { ToastService } from 'src/app/core/services/toast.service';
import { IDossier } from 'src/app/pages/dossier/dossier.model';
import { DossierService } from 'src/app/pages/dossier/dossier.service';
import { BaseListComponent } from '../../base-features/base-list.component';

@Component({
    selector: 'app-select-dossiers',
    templateUrl: './select-dossiers.component.html'
})
export class SelectDossiersComponent extends BaseListComponent<IDossier, number>  {

    dossiers: IDossier[] = [];
    dossiersAsPage: IPagedResult<IDossier>;
    selectedDossierId: string;
    title = 'DATA_SELECTOR.SELECT_DOSSIER';

    constructor(
        private dossierService: DossierService,
        private toastService: ToastService,
        public modalController: ModalController,
        private translate: TranslateService,
    ) {
        super();
    }

    //#region services

    async getDossier(filterOption: IFilterOption) {
        this.loading = true;
        this.subs.sink = this.dossierService.GetAsPagedResult(filterOption)
            .subscribe(result => {
                this.loading = false;
                if (result.status === ResultStatus.Succeed) {
                    this.dossiersAsPage = result;
                    if (this.dossiersAsPage.currentPage === 1) {
                        this.dossiers = [];
                    }
                    this.dossiers = [...this.dossiers, ...this.dossiersAsPage.value];
                } else {
                    this.toastService.presentToast({ message: this.translate.instant('ERRORS.SERVER') });
                }
            });
    }

    //#endregion services

    //#region helper

    async chooseDossier() {
        const dossier = this.dossiers.find(e => e.id === this.selectedDossierId);
        await this.modalController.dismiss(dossier);
    }

    selectDossier(id: string) {
        this.selectedDossierId = id;
    }

    //#endregion
}
