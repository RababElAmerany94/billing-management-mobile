import { Component, Input } from '@angular/core';
import { DossierStatus } from 'src/app/core/enums/dossier-status.enums';
import { IPagedResult } from 'src/app/core/models/general/result-model';
import { IDossier } from 'src/app/pages/dossier/dossier.model';

@Component({
    selector: 'app-evenement-dossier',
    templateUrl: './evenement-dossier.component.html',
    styleUrls: [
        '../../../../../assets/components/dashboard.scss',
        '../../../../../assets/components/input.scss']
})
export class EvenementDossierComponent {

    @Input()
    set data(data: IPagedResult<IDossier>) {
        if (data != null) {
            this.dossierPaged = data;
            this.dossiers = data.value;
        }
    }

    dossierPaged: IPagedResult<IDossier>;
    dossiers: IDossier[] = [];

    /** status of dossier */
    dossierStatus = DossierStatus;

    constructor() { }

    getStatus(status: DossierStatus) {
        return `STATUS_DOSSIER.${status}`;
    }
}
