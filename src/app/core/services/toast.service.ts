import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

export enum ToastTypes {
    Normal = 'normal',
    Success = 'success',
    Danger = 'danger',
    Warning = 'warning'
}

export enum PositionType {
    top = 'top',
    bottom = 'bottom',
    middle = 'middle'
}

interface ToastOptions {
    message?: string;
    closeMsg?: boolean;
    duration?: number;
    type?: ToastTypes;
    position?: PositionType;
}
@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(public toastController: ToastController) { }

    /**
     * present toast
     * @param message the message
     * @param duration the duration timeout
     */
    async presentToast(options: ToastOptions) {
        const message: string = options.message || '';
        const duration: number = options.duration || 2500;
        const type: ToastTypes = options.type || ToastTypes.Normal;
        const position: PositionType = options.position || PositionType.bottom;
        const toast = await this.toastController.create({
            message,
            duration,
            cssClass: `app-toast ${type}`,
            position,
            animated: true,
        });

        toast.present();
    }

}
