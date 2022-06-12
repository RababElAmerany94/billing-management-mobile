import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { StringHelper } from 'src/app/core/helpers/string';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-signature-bon-commande',
  templateUrl: './signature-bon-commande.component.html',
  styleUrls: ['../../../../../assets/components/input.scss']
})
export class SignatureBonCommandeComponent {

  // form group
  form: FormGroup;

  /** signature client */
  signatureClient: string;

  constructor(
    private modalController: ModalController,
    private toaster: ToastService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.initializeForm();
  }

  /** initialise form */
  initializeForm() {
    this.form = this.fb.group({
      nameClientSignature: [null, [Validators.required]],
      dateSignature: [null, [Validators.required]],
    });
  }

  /** dismiss modal controller */
  dismiss() {
    this.modalController.dismiss();
  }

  /** sauvgarde signature */
  save() {
    if (this.form.valid) {
      if (StringHelper.isEmptyOrNull(this.signatureClient)) {
        this.toaster.presentToast({ message: this.translate.instant('ERRORS.VALIDATION_SIGNATURE') });
      } else {
        const value = this.form.value;
        value.signe = this.signatureClient;
        this.modalController.dismiss(value);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

}
