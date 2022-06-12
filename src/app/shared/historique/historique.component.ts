import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IHistorique } from 'src/app/core/models/general/historique';
import { ChangesHistoryType } from 'src/app/core/enums/change-history-type.enum';

@Component({
    selector: 'app-historique',
    templateUrl: './historique.component.html',
    styleUrls: ['./historique.component.scss']
})
export class HistoriqueComponent {

    @Input()
    set Historique(val: IHistorique[]) {
        if (val != null) {
            this.historiques = val;
        }
    }

    @Output()
    backClickEvent = new EventEmitter();

    /** hiostorique list  */
    historiques: IHistorique[] = [];

    /** chnage historique type */
    changesHistoryType: typeof ChangesHistoryType = ChangesHistoryType;

    /** details */
    details: any[] = [];

    constructor() { }

    /**  back click event */
    backClick() {
        this.backClickEvent.emit();
    }

}
