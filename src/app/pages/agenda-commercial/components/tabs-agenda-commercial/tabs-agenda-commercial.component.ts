import { Component, Input, EventEmitter, Output } from '@angular/core';
import { AgendaCommercialListTabs, ITabAgendaCommercialListItem } from 'src/app/core/enums/agenda-commercial-list-tabs.enum';

@Component({
  selector: 'app-tabs-agenda-commercial',
  templateUrl: './tabs-agenda-commercial.component.html'
})
export class TabsAgendaCommercialComponent {

  /** list of tabs */
  tabs: ITabAgendaCommercialListItem[] = this.initTabs();

  /** enumeration tabs */
  agendaCommercialListTabs = AgendaCommercialListTabs;

  /** current tabs */
  @Input() set currentType(value: AgendaCommercialListTabs) {
    if (value != null) {
      this.changeSelectedTab(value);
    }
  }

  /** emit change event */
  @Output()
  changeSelected = new EventEmitter<AgendaCommercialListTabs>();

  /** the current selected tab */
  selectedTab: AgendaCommercialListTabs;

  constructor() { }

  /**
   * init tabs
   */
  private initTabs() {
    return [
      {
        icon: 'calendar-outline',
        label: 'LABELS.AGENDA',
        selected: true,
        type: AgendaCommercialListTabs.Agenda
      },
      {
        icon: 'list-outline',
        label: 'TITLES.TACHES',
        selected: false,
        type: AgendaCommercialListTabs.Tache
      },
      {
        icon: 'journal-outline',
        label: 'LABELS.RENDEZVOUS',
        selected: false,
        type: AgendaCommercialListTabs.Rdv
      },
      {
        icon: 'call-outline',
        label: 'LABELS.APPELS',
        selected: false,
        type: AgendaCommercialListTabs.Appel
      }
    ];
  }

  /**
   * select tab event
   * @param type The type of tab
   */
  selectEvent(type: AgendaCommercialListTabs) {
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
  changeSelectedTab(type: AgendaCommercialListTabs) {
    this.selectedTab = type;
    this.tabs.forEach(item => item.selected = (item.type === this.selectedTab));
  }
}
