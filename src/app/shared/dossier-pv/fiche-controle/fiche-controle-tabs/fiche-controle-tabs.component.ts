import { Component } from '@angular/core';
import { FichierControleTabs, ITabFichierControleItem } from 'src/app/core/enums/fiche-controle.enums';

@Component({
    selector: 'app-fiche-controle-tabs',
    templateUrl: './fiche-controle-tabs.component.html',
})
export class FicheControleTabsComponent {

    /** current tabs */
    selectedTab: FichierControleTabs;

    /** list of tabs */
    tabs: ITabFichierControleItem[] = this.initTabs();

    /** enumeration tabs */
    ficheControleTabs = FichierControleTabs;

    constructor() { }

    /**
     * init tabs
     */
    private initTabs() {
        return [
            {
                icon: 'document-text-outline',
                label: 'TITLES.INFO',
                selected: true,
                type: FichierControleTabs.Info
            },
            {
                icon: 'business-outline',
                label: 'TITLES.CONSTAT_COMBLES',
                selected: false,
                type: FichierControleTabs.ConstatComble
            },
            {
                icon: 'home-outline',
                label: 'TITLES.CONSTAT_PLANCHERS',
                selected: false,
                type: FichierControleTabs.ConstatPlanchers
            },
            {
                icon: 'reader-outline',
                label: 'TITLES.CONSTAT_MURS',
                selected: false,
                type: FichierControleTabs.ConstatMurs
            }
        ];
    }

    /**
     * select tab event
     * @param type The type of tab
     */
    selectEvent(type: FichierControleTabs) {
        // check valid select
        if (this.selectedTab != null && this.selectedTab === type) {
            return;
        }
        // emit change
        this.changeSelectedTab(type);
    }

    /**
     * change selected tab
     * @param type the new selected tab
     */
    changeSelectedTab(type: FichierControleTabs) {
        this.selectedTab = type;
        this.tabs.forEach(item => item.selected = (item.type === this.selectedTab));
    }

}
