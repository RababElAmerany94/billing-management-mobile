import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sign-fiche-controle',
  templateUrl: './sign-fiche-controle.component.html',
  styleUrls: ['../../../../../assets/components/input.scss'],
})
export class SignFicheControleComponent implements OnInit {

  form: FormGroup;

  /** signture client */
  signatureClient: string;

  /** signature techncien */
  signatureController: string;

  title: string;

  /** is in mode readonly */
  readOnly = false;

  /** signture client */
  nameSignatureClient: string;

  constructor(
    public modalController: ModalController,
    private fb: FormBuilder,
    private translate: TranslateService,
    private toaster: ToastService,
    private navParams: NavParams
  ) {
    this.readOnly = this.navParams.get('readOnly');
    this.title = this.navParams.get('title');
    this.nameSignatureClient = this.navParams.get('nameSignatureClient');
    this.signatureController = this.navParams.get('signatureController');
    this.signatureClient = this.navParams.get('signatureClient');
    this.initializeForm();
    this.initializeData();
  }

  ngOnInit() { }

  /** initialize form */
  initializeForm() {
    this.form = this.fb.group({
      nameClientSignature: [null, [Validators.required]],
    });
  }
  initializeData() {
    if (this.readOnly === true) {
      this.form.get('nameClientSignature').setValue(this.navParams.get('nameSignatureClient'));
      this.form.disable();
    } else {
      this.title = 'TITLES.SIGNER_FICHE_DE_CONTROLE';
    }
  }
  //#region Methods

  /** save signature */
  save() {
    if (this.form.valid) {
      if (!this.signatureClient && !this.signatureController) {
        this.toaster.presentToast({ message: this.translate.instant('ERRORS.VALIDATION_SIGNATURE') });
      } else {
        const value = this.form.value;
        value.signatureClient = this.signatureClient;
        value.signatureController = this.signatureController;
        this.modalController.dismiss(value);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  //#endregion
}
