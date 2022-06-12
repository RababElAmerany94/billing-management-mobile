import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientType } from 'src/app/core/enums/client-type.enum';
import { TabClientTypeItem } from 'src/app/core/enums/tab-client-type-item.enum';

@Component({
    selector: 'app-client-tabs',
    templateUrl: './client-tabs.component.html',
})
export class ClientTabsComponent {

    @Output()
    changeSelected = new EventEmitter<ClientType>();

    @Input()
    set currentType(value: ClientType) {
        if (value != null) {
            this.changeSelectedTab(value);
        }
    }

    /** list of tabs */
    tabs: TabClientTypeItem[] = this.initTabs();

    /** enumeration tabs */
    clientTypeTabs = ClientType;

    /** the current selected tab */
    selectedTab: ClientType;

    constructor() { }

    /**
     * init tabs
     */
    private initTabs() {
        return [
            {
                icon: 'person-circle-sharp',
                label: 'LABELS.PARTICULIER',
                selected: true,
                type: ClientType.Particulier
            },
            {
                icon: 'person-circle-outline',
                label: 'LABELS.PROFESSIONNEL',
                selected: false,
                type: ClientType.Professionnel
            },
            {
                icon: 'person',
                label: 'LABELS.OBLIGES',
                selected: false,
                type: ClientType.Obliges
            }
        ];
    }

    /**
     * select tab event
     * @param type The type of tab
     */
    selectEvent(type: ClientType) {
        // check valid select
        if (this.selectedTab != null && this.selectedTab === type) {
            return;
        }

        // emit change
        this.changeSelectedTab(type);
        this.changeSelected.emit(this.selectedTab);
    }

    /**
     * change selected tab
     * @param type the new selected tab
     */
    changeSelectedTab(type: ClientType) {
        this.selectedTab = type;
        this.tabs.forEach(item => item.selected = (item.type === this.selectedTab));
    }

}
