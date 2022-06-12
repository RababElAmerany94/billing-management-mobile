import { Component } from '@angular/core';
import { BaseUiCustomComponent } from '../base-ui-custom.component';

@Component({
  selector: 'app-custom-checkbox',
  templateUrl: './custom-checkbox.component.html',
  styleUrls: ['../../../../assets/components/input.scss']
})
export class CustomCheckboxComponent extends BaseUiCustomComponent {

  constructor() {
    super();
  }

}
