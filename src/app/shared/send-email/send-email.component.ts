import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ToastService } from 'src/app/core/services/toast.service';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { DocumentParamterType } from 'src/app/core/enums/document-parameter-type.enum';
import { IMailHistoryModel, IMailModel } from 'src/app/core/models/general/mail.model';
import { StringHelper } from 'src/app/core/helpers/string';
import { JsonHelper } from 'src/app/core/helpers/json';
import { IContact } from 'src/app/core/models/general/contacts.model';
import { DocumentParameterService } from 'src/app/core/services/documentParameter-service/document-parameter.service';
import { ResultStatus } from 'src/app/core/enums/result-status';
import { IFactureDocumentParameters, IDevisDocumentParameters } from 'src/app/core/models/general/document-parameter.model';

@Component({
  selector: 'app-shared-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['../../../assets/components/input.scss']
})
export class SendEmailComponent implements OnInit {

  /** the title of dialog */
  title: string;

  /** form group */
  form: FormGroup;

  /** list of emails */
  emails: IMailHistoryModel[] = [];


  /** the type of document */
  type: DocumentParamterType;

  /** emails of contacts client */
  emailsTo: string[] = [];

  /** can revive email */
  canRevive = true;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    public modalCtrl: ModalController,
    public toastService: ToastService,
    private navParams: NavParams,
    private documentParametersService: DocumentParameterService
  ) {
    this.initializeForm();
    const emails = this.navParams.get('emails');
    this.setEmails(emails);
    const contacts = this.navParams.get('contacts');
    this.setEmailsContacts(contacts);
    this.type = this.navParams.get('type');
    this.canRevive = this.navParams.get('canRevive');
  }

  /**
   * initialize form
   */
  initializeForm() {
    this.form = this.fb.group({
      emailsTo: [null],
      subject: [null, [Validators.required]],
      body: [null, [Validators.required]]
    });
  }
  ngOnInit() {
    this.setDefaultValue();
  }

  // #region  helper
  close = () => this.modalCtrl.dismiss();


  /** test validate emails */
  validateEmail = (control: AbstractControl) => control.value.match(AppSettings.regexEmail) ? null : { emailErr: true };


  /** setEmails contacts */
  setEmailsContacts(value: string) {
    if (!StringHelper.isEmptyOrNull(value) && JsonHelper.isJsonString(value)) {
      const contacts = JSON.parse(value) as IContact[];
      this.emailsTo = contacts.filter(e => !StringHelper.isEmptyOrNull(e.email)).map(e => e.email);
    }
  }
  setEmails(value: string) {
    if (!StringHelper.isEmptyOrNull(value) && JsonHelper.isJsonString(value)) {
      this.emails = JSON.parse(value);
    }
  }

  /*** get title */
  getTitle() {
    return this.canRevive && this.emails.length > 0 ? 'EMAILS.REVIVE' : 'EMAILS.SEND';
  }

  /** set default values */
  setDefaultValue() {
    this.documentParametersService.Get().subscribe(res => {
      if (res.status === ResultStatus.Succeed) {
        if (this.type === DocumentParamterType.Facture) {
          const factureParameters = res.value.facture as IFactureDocumentParameters;
          this.form.patchValue({
            subject: this.emailsTo.length === 0 ? factureParameters.sujetMail : factureParameters.sujetRelance,
            body: this.emailsTo.length === 0 ? factureParameters.contenuMail : factureParameters.contenuRelance
          });
        } else if (this.type === DocumentParamterType.Devis) {
          const devisParameters = res.value.devis as IDevisDocumentParameters;
          this.form.patchValue({
            subject: devisParameters.sujetMail,
            body: devisParameters.contenuMail
          });
        }
      }
    });
  }
  /**
   * send email
   */
  send() {
    this.emailsTo = this.emailsTo.filter(e => typeof e === 'string').concat(
      this.emailsTo.filter(e => typeof e === 'object' && 'display' in e).map(e => e['display'.toString()]));

    if (this.form.valid && this.emailsTo.length > 0) {
      const emailModel: IMailModel = { ...this.form.value };
      emailModel.emailTo = this.emailsTo;
      this.modalCtrl.dismiss(emailModel);
    } else {
      this.form.markAllAsTouched();
      this.toastService.presentToast({ message: this.translate.instant('ERRORS.FILL_ALL') });
    }
  }
  // #endregion
}
