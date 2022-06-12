import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ITabDetailItem } from 'src/app/core/models/general/tab-detail-item.model';
import { TabType } from 'src/app/core/enums/tab-type.enum';

@Component({
  selector: 'app-tabs-detail',
  templateUrl: './tabs-detail.component.html'
})
export class TabsDetailComponent {

  /** event change select tab */
  @Output()
  selectedEvent = new EventEmitter<ITabDetailItem[]>();

  /** the list of tabs */
  @Input()
  tabs: ITabDetailItem[];

  /** the list of tabs */
  @Input()
  isAppear: true;

  /** the current selected tab */
  currentType: TabType;

  constructor() { }

  /**
   * select tab event
   * @param type The type of tab
   */
  selectEvent(type: TabType) {

    // check valid select
    if (this.currentType != null && this.currentType === type) {
      return;
    }

    // emit change
    this.currentType = type;
    this.tabs.forEach(item => item.selected = (item.type === this.currentType));
    this.selectedEvent.emit(this.tabs);
  }

}
