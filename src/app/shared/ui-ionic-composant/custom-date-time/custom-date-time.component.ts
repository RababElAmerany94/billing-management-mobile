import { Component, Input } from '@angular/core';
import { BaseUiCustomComponent } from '../base-ui-custom.component';

@Component({
  selector: 'app-custom-date-time',
  templateUrl: './custom-date-time.component.html'
})
export class CustomDateTimeComponent extends BaseUiCustomComponent {

  @Input()
  readOnly = false;

  @Input()
  formaDate = 'DD/MM/YYYY';

  constructor() {
    super();
  }
}
