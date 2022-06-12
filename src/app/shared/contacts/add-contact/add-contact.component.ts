import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { IContact } from 'src/app/core/models/general/contacts.model';
import { ToastService, ToastTypes } from '../../../core/services/toast.service';

@Component({
    selector: 'app-add-contact',
    templateUrl: './add-contact.component.html',
    styleUrls: ['./../../../../assets/components/input.scss']
})
export class AddContactComponent implements OnInit {

    @Output() listContacts = new EventEmitter();
    form: FormGroup;
    valueContact: any;
    contact: IContact;
    title: string;
    contacts: IContact[] = [];

    constructor(
        private fb: FormBuilder,
        private navParams: NavParams,
        private translate: TranslateService,
        private toastService: ToastService,
        private modalController: ModalController
    ) {
        this.initializeForm();
        this.contact = this.navParams.get('contact');
        if (this.contact != null) {
            this.chargeContact();
        }
    }

    ngOnInit() {
        this.chargeDropDownCivilite();
    }

    /*** forme initialization */
    initializeForm() {
        this.form = this.fb.group({
            civilite: [null, [Validators.required]],
            nom: [null, [Validators.required]],
            prenom: [null, [Validators.required]],
            fonction: [null],
            email: [null, [Validators.pattern(AppSettings.regexEmail)]],
            mobile: [null, [Validators.pattern(AppSettings.regexPhone)]],
            commentaire: [null],
            isDefault: [false]
        });
    }

    /** charge dropdown civilite */
    chargeDropDownCivilite() {
        this.valueContact = [
            {
                value: '',
                text: 'CONTACTS.SELECTIONNER'
            },
            {
                value: 'M.',
                text: 'CONTACTS.MONSIEUR'
            },
            {
                value: 'Mme.',
                text: 'CONTACTS.MADAME'
            },
            {
                value: 'Mlle',
                text: 'CONTACTS.MADEMOISELLE'
            }
        ];
    }

    /** sauvgarde contact */
    saveContact() {
        if (this.form.valid) {
            const values = this.form.getRawValue();
            this.modalController.dismiss(values);
        } else {
            this.toastService.presentToast({ message: this.translate.instant('ERRORS.FILL_ALL'), type: ToastTypes.Danger });
            this.form.markAllAsTouched();
        }
    }

    /** charge contact */
    chargeContact() {
        if (this.contact) {
            this.form.get('civilite').setValue(this.contact.civilite);
            this.form.get('nom').setValue(this.contact.nom);
            this.form.get('prenom').setValue(this.contact.prenom);
            this.form.get('fonction').setValue(this.contact.fonction);
            this.form.get('email').setValue(this.contact.email);
            this.form.get('mobile').setValue(this.contact.mobile);
            this.form.get('commentaire').setValue(this.contact.commentaire);

            setTimeout(() => {
                this.form.get('isDefault').setValue(this.contact.isDefault);
                this.contact.isDefault ? this.form.get('isDefault').disable() : this.form.get('isDefault').enable();
                this.form.get('isDefault').updateValueAndValidity();
            }, 500);
        }
    }

    /** dismiss modal controller */
    async dismiss() {
        await this.modalController.dismiss();
    }

}
