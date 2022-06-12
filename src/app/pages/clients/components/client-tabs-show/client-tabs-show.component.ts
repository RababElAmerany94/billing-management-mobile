import { Component, Output, Input, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ITabShowItem, ShowTabs } from '../../../../core/enums/dossier-tabs.enum';

@Component({
  selector: 'app-client-tabs-show',
  templateUrl: './client-tabs-show.component.html',
})
export class ShowTabsComponent {

  /** list of tabs */
  tabs: ITabShowItem[] = this.initTabs();

  /** enumeration tabs */
  showTabs = ShowTabs;

  /** current tabs */
  @Input() currentType: ShowTabs;

  /** emit change event */
  @Output() changeSelected = new EventEmitter<ShowTabs>();

  constructor(
    private translate: TranslateService) { }
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
        type: ShowTabs.Info
      },
      {
        icon: 'file-tray-stacked-outline',
        label: this.translate.instant('TITLES.HISTORY'),
        selected: false,
        appear: true,
        type: ShowTabs.History
      },
      {
        icon: 'albums-outline',
        label: this.translate.instant('TITLES.MEMOS'),
        selected: false,
        appear: true,
        type: ShowTabs.Memo
      },
      {
        icon: 'calendar-outline',
        label: this.translate.instant('TITLES.AGENDA_COMMERCIAL'),
        selected: false,
        appear: true,
        type: ShowTabs.AgendaCommercial
      }
    ];
  }

  /**
   * select tab event
   * @param type The type of tab
   */
  selectEvent(type: ShowTabs) {
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
