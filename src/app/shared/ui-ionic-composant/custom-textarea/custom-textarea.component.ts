import { Component } from '@angular/core';
import { BaseUiCustomComponent } from '../base-ui-custom.component';

@Component({
  selector: 'app-custom-textarea',
  templateUrl: './custom-textarea.component.html'
})
export class CustomTextareaComponent extends BaseUiCustomComponent {

  constructor() {
    super();
  }
}
