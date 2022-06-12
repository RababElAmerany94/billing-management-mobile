import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { UserHelper } from 'src/app/core/helpers/user';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ToastService, ToastTypes } from 'src/app/core/services/toast.service';
import { TranslationService } from 'src/app/core/services/translation.service';
import { PushNotificationService } from 'src/app/core/services/push-notification.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

    /** formGroup */
    loginForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private translateService: TranslationService,
        private toastService: ToastService,
        private authService: AuthService,
        private platform: Platform,
        private loadingService: LoadingService,
        private translate: TranslateService,
        private pushNotificationService: PushNotificationService) { }

    /**
     * Form initialization
     */
    initLoginForm() {
        this.loginForm = this.fb.group({
            userName: [null, [Validators.required]],
            password: [null, [Validators.required]
            ]
        });
    }

    /** on init */
    async ngOnInit() {
        this.translateService.setLanguage(this.translate);
        this.initLoginForm();
    }

    /**
     * ion view init
     */
    async ionViewDidEnter(): Promise<void> {
        this.platform.ready().then(_ => {
            if (UserHelper.isAuthenticated()) {
                this.authService.IsAuthenticated(true);
                this.router.navigateByUrl('/dashboard');
            }
        });
    }

    /**
     * go to forget password
     */
    goToForgetPassword() {
        this.router.navigate(['/forget-password']);
    }

    /**
     * Form Submit
     */
    async submit() {
        console.log(this.loginForm.valid);

        if (this.loginForm.value) {
            const formData = this.loginForm.value;
            await this.loadingService.show(this.translate.instant('LABELS.LOADING_LOGIN'));
            this.authService.Login(formData.userName, formData.password).subscribe(async res => {
                await this.loadingService.hide();
                if (res.actif) {
                    localStorage.setItem(AppSettings.TOKEN, res.token);
                    localStorage.setItem(AppSettings.ROLE_ID, res.roleId.toString());
                    localStorage.setItem(AppSettings.USERNAME, formData.userName);
                    this.authService.IsAuthenticated(true);
                    this.pushNotificationService.setUserId(UserHelper.getUserId().toString());
                    this.pushNotificationService.subscribe();
                    this.router.navigate(['/dashboard']);
                } else {
                    this.toastService.presentToast({
                        message: this.translate.instant('ERRORS.IN_ACTIVE_ACCOUNT'),
                        type: ToastTypes.Success
                    });
                }
            }, async _ => {
                this.toastService.presentToast({
                    message: this.translate.instant('ERRORS.INCORRECT_CONNECTION'),
                    type: ToastTypes.Danger
                });
                await this.loadingService.hide();
            });
        } else {
            this.loginForm.markAllAsTouched();
            await this.loadingService.hide();
        }
    }

}
