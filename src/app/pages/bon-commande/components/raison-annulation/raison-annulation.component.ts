import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService, ToastTypes } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-raison-annulation',
  templateUrl: './raison-annulation.component.html'
})
export class RaisonAnnulationComponent {

  /** form group */
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private toastService: ToastService,
    public translate: TranslateService
  ) {
    this.initializeForm();
  }

  /**
   * init form
   */
  initializeForm() {
    this.form = this.fb.group({
      raisonAnnulation: [null, [Validators.required]],
    });
  }


  /** dismiss modal  */
  Dismiss() {
    this.modalController.dismiss();
  }

  /** save  */
  async save() {
    if (this.form.valid) {
      const values = this.form.getRawValue();
      this.modalController.dismiss(values);
    } else {
      this.toastService.presentToast({ message: this.translate.instant('ERRORS.FILL_ALL'), type: ToastTypes.Danger });
      this.form.markAllAsTouched();
    }
  }

}
