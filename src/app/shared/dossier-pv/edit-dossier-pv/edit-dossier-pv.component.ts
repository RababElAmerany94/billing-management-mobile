import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { StringHelper } from 'src/app/core/helpers/string';
import { IDossierPV, IDossierPVModel } from 'src/app/core/models/dossier/dossierPVModel';
import { IArticle } from 'src/app/core/models/general/article.model';
import { IPhotoDocument } from 'src/app/core/models/general/photo-document';
import { ToastService } from 'src/app/core/services/toast.service';
import { BaseEditComponent } from '../../base-features/base-edit.component';

@Component({
    selector: 'app-edit-dossier-pv',
    templateUrl: './edit-dossier-pv.component.html',
    styleUrls: ['../../../../assets/components/input.scss'],
})
export class EditDossierPvComponent extends BaseEditComponent<IDossierPVModel> {

    form: FormGroup;

    /** the title of modal */
    title: string;

    /** photos document */
    photos: IPhotoDocument[] = [];

    /** is in mode readonly */
    readOnly = false;

    /** signture client */
    signatureClient: string;

    /** signature techncien */
    signatureTechnicien: string;

    /** list articles */
    articles: IArticle[] = [];

    constructor(
        public modalController: ModalController,
        private toaster: ToastService,
        private fb: FormBuilder,
        private translate: TranslateService,
        private navParams: NavParams
    ) {
        super();
        this.title = this.navParams.get('title');
        this.readOnly = this.navParams.get('readOnly');
        this.articles = this.navParams.get('articles');
        this.initializeForm();
        this.initializeData(this.navParams.get('dossierPV'));
    }

    /** initialize form */
    initializeForm() {
        this.form = this.fb.group({
            nameClientSignature: [null, [Validators.required]],
            reasonNoSatisfaction: [null],
            isSatisfied: [false],
        });
    }

    /** initialization component */
    initializeData(pv: IDossierPV) {
        if (pv != null) {
            this.setDataForm(pv);
            this.photos = pv.photos;
            this.signatureClient = pv.signatureClient;
            this.signatureTechnicien = pv.signatureTechnicien;
        }
        if (this.readOnly === true) {
            this.form.disable();
        }
    }

    /**
     * set data in form
     */
    setDataForm(pv: IDossierPV) {
        this.form.setValue({
            nameClientSignature: pv.nameClientSignature,
            reasonNoSatisfaction: pv.reasonNoSatisfaction,
            isSatisfied: pv.isSatisfied,
        });
    }

    //#region methods

    /** save signature */
    save() {
        if (this.form.valid) {
            if (StringHelper.isEmptyOrNull(this.signatureClient) || StringHelper.isEmptyOrNull(this.signatureTechnicien)) {
                this.toaster.presentToast({ message: this.translate.instant('ERRORS.VALIDATION_SIGNATURE') });
            } else {
                const value = this.form.value;
                value.signatureClient = this.signatureClient;
                value.signatureTechnicien = this.signatureTechnicien;
                value.photos = JSON.stringify(this.photos);
                this.modalController.dismiss(value);
            }
        } else {
            this.form.markAllAsTouched();
        }
    }

    //#endregion

    //#region helpers
    isSatisfied() {
        return this.form.get('isSatisfied').value === true;
    }
    //#endregion
}
