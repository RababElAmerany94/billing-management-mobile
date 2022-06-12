import { Component, Input } from '@angular/core';
import { BaseUiCustomComponent } from '../base-ui-custom.component';

@Component({
  selector: 'app-custum-editor-text',
  templateUrl: './custum-editor-text.component.html',
  styleUrls: ['../../../../assets/components/input.scss']
})

export class CustumEditorTextComponent extends BaseUiCustomComponent {
  @Input() readOnly = false;
  constructor() {
    super();
  }


}
