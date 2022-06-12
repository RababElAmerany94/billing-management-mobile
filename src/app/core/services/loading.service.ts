import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    loader: HTMLIonLoadingElement;
    isLoading = false;

    constructor(
        private loadingCtr: LoadingController) { }

    /** show loader */
    async show(message: string) {
        if (!this.isLoading) {
            this.isLoading = true;
            this.loader = await this.loadingCtr.create({
                message,
                spinner: 'circular'
            });
            await this.loader.present();
        }
    }

    /** hide loader */
    async hide() {
        if (this.isLoading && this.loader != null) {
            this.isLoading = false;
            await this.loader.dismiss();
        }
    }

}
