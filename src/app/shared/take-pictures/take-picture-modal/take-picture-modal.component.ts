import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Camera } from '@ionic-native/camera/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ResultStatus } from 'src/app/core/enums/result-status';
import { DateHelper } from 'src/app/core/helpers/date';
import { FileHelper } from 'src/app/core/helpers/file';
import { StringHelper } from 'src/app/core/helpers/string';
import { IPhotoDocument } from 'src/app/core/models/general/photo-document';
import { PieceJoin } from 'src/app/core/models/general/pieceJoin.model';
import { FileManagerService } from 'src/app/core/services/file-manager/file-manager.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
    selector: 'app-take-picture-modal',
    templateUrl: './take-picture-modal.component.html',
    styleUrls: ['../../../../assets/components/input.scss'],
})
export class TakePictureModalComponent {

    /** readonly data or take picture */
    readonly = false;

    /** formGroup  */
    form: FormGroup;

    /** photo document */
    photoDocument: IPhotoDocument;

    /** piece join */
    pieceJoin: PieceJoin;

    /** the title of popup */
    title = 'TITLES.ANOMALIE_PICTURE';

    constructor(
        public modalCtrl: ModalController,
        private translate: TranslateService,
        private camera: Camera,
        private fb: FormBuilder,
        private toastService: ToastService,
        private photoViewer: PhotoViewer,
        private navParams: NavParams,
        private fileManagerService: FileManagerService
    ) {
        this.initializeForm();
        this.setDataComponent();
    }

    //#region form

    initializeForm() {
        this.form = this.fb.group({
            commentaire: [null, []]
        });
    }

    setFormData(photoDocument: IPhotoDocument) {
        this.form.setValue({
            commentaire: photoDocument.commentaire
        });
    }

    //#endregion

    buildPhotoDocumentObject(): IPhotoDocument {
        return {
            commentaire: this.form.value.commentaire,
            image: this.pieceJoin
        };
    }

    save() {
        if (this.pieceJoin != null) {
            this.modalCtrl.dismiss(this.buildPhotoDocumentObject());
        } else {
            this.toastService.presentToast({ message: this.translate.instant('ERRORS.VALIDATION_PICTURE') });
        }
    }

    //#region helpers

    selectImage() {
        FileHelper.takePicture(this.camera).then(async (base64: string) => {
            this.pieceJoin = {
                name: StringHelper.guid(),
                type: 'image/jpeg',
                orignalName: `${DateHelper.getNowDateForIdentityValue()}.jpeg`,
                file: base64
            };
        });
    }

    previewImage() {
        const imageName = this.photoDocument.image.name;
        this.getImage(imageName, (base64) => {
            this.photoViewer.show(base64);
        });
    }

    setDataComponent() {
        this.title = this.navParams.get('title') as string;
        this.readonly = this.navParams.get('readonly') as boolean;
        if (this.readonly) {
            this.form.disable();
        }
        this.photoDocument = this.navParams.get('photoDocument') as IPhotoDocument;
        if (this.photoDocument != null) {
            this.pieceJoin = this.photoDocument.image;
            this.setFormData(this.photoDocument);
        }
    }

    isEmptyOrNull = (value: string) => StringHelper.isEmptyOrNull(value);

    //#endregion

    //#region services

    getImage(name: string, callbackSucceeded: (base64: string) => void) {
        this.fileManagerService.Get(name).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                callbackSucceeded(result.value);
            } else {
                this.toastService.presentToast({ message: this.translate.instant('ERRORS.SERVER') });
            }
        });
    }

    //#endregion

}
