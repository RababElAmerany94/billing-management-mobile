import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EChangeCommercialDetailTabs, ITabEChangeCommercialShowItem } from './../../../../core/enums/echange-commercial-detail-tabs.enum';

@Component({
    selector: 'app-tabs-detail-agenda-commercial',
    templateUrl: './tabs-detail-agenda-commercial.component.html'
})
export class TabsDetailAgendaCommercialComponent {

    @Output()
    changeSelected = new EventEmitter<EChangeCommercialDetailTabs>();

    @Input()
    currentType: EChangeCommercialDetailTabs;

    tabs: ITabEChangeCommercialShowItem[] = this.initTabs();
    echangeCommercialShowTabs = EChangeCommercialDetailTabs;

    constructor(
        private translate: TranslateService
    ) { }

    /**
     * init tabs
     */
    private initTabs() {
        return [
            {
                icon: 'person-circle',
                label: this.translate.instant('TITLES.INFO'),
                selected: true,
                appear: true,
                type: EChangeCommercialDetailTabs.Info
            },
            {
                icon: 'file-tray-stacked-outline',
                label: this.translate.instant('TITLES.HISTORY'),
                selected: false,
                appear: true,
                type: EChangeCommercialDetailTabs.History
            },
            {
                icon: 'albums-outline',
                label: this.translate.instant('TITLES.MEMOS'),
                selected: false,
                appear: true,
                type: EChangeCommercialDetailTabs.Memo
            }
        ];
    }

    /**
     * select tab event
     * @param type The type of tab
     */
    selectEvent(type: EChangeCommercialDetailTabs) {
        // check valid select
        if (this.currentType != null && this.currentType === type) {
            return;
        }
        // emit change
        this.currentType = type;
        this.tabs.forEach(item => item.selected = (item.type === this.currentType));
        this.changeSelected.emit(this.currentType);
    }

}
