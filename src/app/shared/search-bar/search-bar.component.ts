import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
})
export class SearchBarComponent {

  /**
   * test if search bart visible or not
   */
  @Input()
  state = 'hidden';

  /**
   * show validation button or not
   */
  @Input()
  showValidationButton = false;

  /**
   * search value
   */
  @Input()
  searchValue = '';
  /*
  * show keword update event
  */
  @Output()
  searchEvent = new EventEmitter<string>();

  constructor() { }

  /** on search event */
  onSearchEvent(event: string): void {
    this.searchEvent.emit(event);
  }

}
