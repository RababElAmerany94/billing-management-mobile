import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { SubSink } from 'subsink';
import { TranslationService } from 'src/app/core/services/translation.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['../login/login.component.scss'],
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {

  subsink = new SubSink();

  // Public params
  forgotPasswordForm: FormGroup;
  loading = false;

  constructor(
    private translateService: TranslationService,
    private translate: TranslateService,
    private fb: FormBuilder,
  ) { }

  /**
   * On init
   */
  async ngOnInit() {
    this.initForgetPasswordForm();
    this.translateService.setLanguage(this.translate);
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.subsink.unsubscribe();
    this.loading = false;
  }

  /**
   * Form initalization
   * Default params, validators
   */
  initForgetPasswordForm() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', Validators.compose(
        [Validators.required,
        Validators.pattern(AppSettings.regexEmail)
        ]
      )]
    });
  }

  /**
   * Form Submit
   */
  submit() {
    const formvalue = this.forgotPasswordForm.value;

    // Todo
  }
}
