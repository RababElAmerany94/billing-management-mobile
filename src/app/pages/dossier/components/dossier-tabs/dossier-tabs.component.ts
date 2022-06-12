import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { ShowTabs, ITabShowItem } from 'src/app/core/enums/dossier-tabs.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dossier-tabs',
  templateUrl: './dossier-tabs.component.html',
})
export class DossierTabsComponent implements OnInit {

  /** current tabs */
  @Input() currentType: ShowTabs;

  /** emit change event */
  @Output() changeSelected = new EventEmitter<ShowTabs>();

  @Input()
  canAddVisiteTechnique = false;

  /** list of tabs */
  tabs: ITabShowItem[];

  /** enumeration tabs */
  dossierTabs = ShowTabs;

  constructor(
    private translate: TranslateService) { }

  ngOnInit() {
    this.tabs = this.initTabs();
  }

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
        icon: 'clipboard',
        label: this.translate.instant('TITLES.VISITE_TECHNIQUE'),
        selected: false,
        appear: !this.canAddVisiteTechnique,
        type: ShowTabs.visiteTechnique
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
