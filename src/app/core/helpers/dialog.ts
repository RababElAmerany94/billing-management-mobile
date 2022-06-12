import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

export interface AlertOptions {
    headerText?: string;
    message?: string;
    closeButtonText?: string;
    validButtonText?: string;
    cancel?: () => void;
    done?: () => void;
    alertCancelCss?: string;
    alertValidCss?: string;
}

export class DialogHelper {

    static async presentAlert(alertCtrl: AlertController, translate: TranslateService, options: AlertOptions) {
        const alert = await alertCtrl.create({
            header: options.headerText,
            message: options.message,
            cssClass: 'alert-message-custom',
            buttons: [
                {
                    text: options.closeButtonText || translate.instant('LABELS.CANCEL'),
                    role: 'cancel',
                    cssClass: options.alertCancelCss || 'alert-cancel',
                    handler: () => {
                        options.cancel();
                    }
                }, {
                    text: options.validButtonText || translate.instant('LABELS.DONE'),
                    cssClass: options.alertValidCss || 'alert-valid',
                    handler: () => {
                        options.done();
                    }
                }
            ]
        });
        await alert.present();
    }

    /**
     * open dialog
     */
    static async openDialog(modalController: ModalController, ModalComponent: any, data: any) {
        const modal = await modalController.create({
            component: ModalComponent,
            componentProps: data,
            animated: true
        });
        modal.present();
        return modal.onDidDismiss().then((result) => {
            return result.data;
        });
    }
}
