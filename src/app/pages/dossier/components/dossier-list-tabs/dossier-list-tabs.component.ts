import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITabDossierListItem, DossierListTabs } from '../../../../core/enums/dossier-list-tabs.enum';

@Component({
  selector: 'app-dossier-list-tabs',
  templateUrl: './dossier-list-tabs.component.html'
})
export class DossierListTabsComponent {

  /** list of tabs */
  tabs: ITabDossierListItem[] = this.initTabs();

  /** enumeration tabs */
  dossierListTabs = DossierListTabs;

  /** current tabs */
  @Input() set currentType(value: DossierListTabs) {
    if (value != null) {
      this.changeSelectedTab(value);
    }
  }

  /** emit change event */
  @Output()
  changeSelected = new EventEmitter<DossierListTabs>();

  /** the current selected tab */
  selectedTab: DossierListTabs;

  constructor() { }

  /**
   * init tabs
   */
  private initTabs() {
    return [
      {
        icon: 'checkmark-outline',
        label: 'LABELS.A_VALIDER',
        selected: true,
        type: DossierListTabs.AValider
      },
      {
        icon: 'stopwatch-outline',
        label: 'LABELS.A_VENIR',
        selected: false,
        type: DossierListTabs.AVenir
      },
      {
        icon: 'arrow-undo-outline',
        label: 'LABELS.A_REPLANIFIER',
        selected: false,
        type: DossierListTabs.AReplanifier
      },
      {
        icon: 'albums-outline',
        label: 'LABELS.ALL_DOSSIERS',
        selected: false,
        type: DossierListTabs.Toutes
      }
    ];
  }

  /**
   * select tab event
   * @param type The type of tab
   */
  selectEvent(type: DossierListTabs) {
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
  changeSelectedTab(type: DossierListTabs) {
    this.selectedTab = type;
    this.tabs.forEach(item => item.selected = (item.type === this.selectedTab));
  }

}
