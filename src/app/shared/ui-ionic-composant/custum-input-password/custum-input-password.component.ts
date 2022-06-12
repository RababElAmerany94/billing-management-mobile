import { Component, EventEmitter, Output } from '@angular/core';
import { BaseUiCustomComponent } from '../base-ui-custom.component';

@Component({
  selector: 'app-custum-input-password',
  templateUrl: './custum-input-password.component.html'
})
export class CustumInputPasswordComponent extends BaseUiCustomComponent {

  @Output() inputEvent = new EventEmitter();
  type = 'password';

  constructor() {
    super();
  }

  /**
   * Emit input event to parent
   */
  input(event) {
    this.inputEvent.emit(event);
  }

  /**
   * toggle show and hide password
   */
  toggleShowPassword() {
    this.type = this.type === 'password' ? 'text' : 'password';
  }
}
