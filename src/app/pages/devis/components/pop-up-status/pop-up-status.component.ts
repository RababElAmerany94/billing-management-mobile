import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
    selector: 'app-pop-up-status',
    templateUrl: './pop-up-status.component.html',
})
export class PopUpStatusComponent {

    /** status of devis */
    isSigne: boolean;

    /** form group */
    form: FormGroup;

    constructor(
        private modalController: ModalController,
        private fb: FormBuilder,
        private navParams: NavParams
    ) {
        this.isSigne = this.navParams.get('isSigne');
        this.initializeForm();
    }

    /**
     * init form
     */
    initializeForm() {
        if (this.isSigne) {
            this.form = this.fb.group({
                dateSignature: [null, [Validators.required]],
            });
        } else {
            this.form = this.fb.group({
                raisonPerdue: [null, [Validators.required]],
            });
        }

    }

    /**
     * save changes
     */
    save() {
        if (this.form.valid) {
            const values = this.form.getRawValue();
            this.modalController.dismiss(values);
        } else {
            this.form.markAllAsTouched();
        }
    }

    /** dismiss modal controllar */
    async Dismiss(value) {
        await this.modalController.dismiss(value);
    }
}
