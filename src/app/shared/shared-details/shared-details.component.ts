import { Component } from '@angular/core';
import { ITabDetailItem } from 'src/app/core/models/general/tab-detail-item.model';
import { TranslateService } from '@ngx-translate/core';
import { TabType } from 'src/app/core/enums/tab-type.enum';

@Component({
  selector: 'app-shared-details',
  templateUrl: './shared-details.component.html'
})
export class SharedDetailsComponent {

  /** list of tabs */
  tabs: ITabDetailItem[] = this.initTabs();

  /** type of tabs */
  type = TabType;

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
        type: TabType.Information,
        appear: true,
      },
      {
        icon: 'file-tray-stacked-outline',
        label: this.translate.instant('TITLES.HISTORY'),
        selected: false,
        type: TabType.History,
        appear: true,
      }
    ];
  }

}
