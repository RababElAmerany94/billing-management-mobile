import { Component, Input } from '@angular/core';
import { DossierStatus } from 'src/app/core/enums/dossier-status.enums';
import { EchangeCommercialStatus } from 'src/app/core/enums/echange-commercial-status.enum';
import { EchangeCommercialType } from 'src/app/core/enums/echange-commercial-type.enum';
import { IPagedResult } from 'src/app/core/models/general/result-model';
import { IEchangeCommercial } from 'src/app/pages/agenda-commercial/echange-commercial.model';

@Component({
    selector: 'app-evenement-agenda',
    templateUrl: './evenement-agenda.component.html',
    styleUrls: [
        './../../../../shared/historique/historique.component.scss'
    ],
})
export class EvenementAgendaComponent {

    @Input()
    set data(data: IPagedResult<IEchangeCommercial>) {
        if (data != null) {
            this.echangeCommercialPaged = data;
            this.echangeCommercials = data.value;
        }
    }

    echangeCommercialPaged: IPagedResult<IEchangeCommercial>;
    echangeCommercials: IEchangeCommercial[];
    status = EchangeCommercialStatus;
    type = EchangeCommercialType;

    constructor() { }

    getStatus(status: DossierStatus) {
        return `STATUS_DOSSIER.${status}`;
    }

}
