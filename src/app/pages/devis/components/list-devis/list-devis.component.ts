import { Component, Input, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { BaseListComponent } from 'src/app/shared/base-features/base-list.component';
import { IDevis, IDevisDataList } from '../../devis.model';
import { IPagedResult } from 'src/app/core/models/general/result-model';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { DevisStatus } from 'src/app/core/enums/devis-status.enum';
import { DevisHelper } from 'src/app/core/helpers/devis';
import { ICalculation, CalculationToken } from 'src/app/core/helpers/calculation/icalculation';

@Component({
    selector: 'app-list-devis',
    templateUrl: './list-devis.component.html',
    styleUrls: ['../../../../../assets/components/lists.scss'],

})
export class ListDevisComponent extends BaseListComponent<IDevis, number> {

    @Input()
    set data(data: IPagedResult<IDevis>) {
        if (data != null) {
            this.devisPagedResult = { ...data as IPagedResult<any> };
            this.devis = data.value;
            this.devisList = data.value.map<IDevisDataList>(e => this.mapIDevisIntoIDevisDataList(e));
        }
    }

    /** list dossiers */
    devisList: IDevisDataList[];

    /** list deviss */
    devis: IDevis[];

    /** list of devis */
    devisPagedResult: IPagedResult<IDevis>;

    /** status of devis */
    devisStatus = DevisStatus;

    constructor(
        @Inject(CalculationToken)
        private calculation: ICalculation,
        public translate: TranslateService,
        private alertController: AlertController
    ) {
        super();
        this.setModule(this.modules.Devis);
    }
    //#region events

    /**
     * delete click
     */
    deleteClick(index: string) {
        const devise = this.devis[index];
        DialogHelper.presentAlert(
            this.alertController,
            this.translate,
            {
                headerText: this.translate.instant('LIST.DELETE.HEADER'),
                message: this.translate.instant('LIST.DELETE.MESSAGE') + ':' + devise.reference.toUpperCase() + ' ? ',
                done: async () => {
                    this.deleteEvent.emit(devise.id);
                },
                cancel: () => { }
            }
        );
    }

    /** map devis to devis dataList model */
    mapIDevisIntoIDevisDataList(devis: IDevis): IDevisDataList {
        const devisDataList: IDevisDataList = {
            id: devis.id,
            reference: devis.reference,
            client: devis.client.fullName,
            dateSignature: devis.dateSignature,
            type: devis.type,
            status: devis.status,
            nouveauAvancementPercent: DevisHelper.percentFacturationDevis(this.calculation, devis),
            canModify: DevisHelper.canEdit(devis.status)
        };

        return devisDataList;
    }

    //#endregion

    //#region helper

    getStatus(status: DevisStatus) {
        return `DEVIS_STATUS.${status}`;
    }

    //#endregion

}
