import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { StringHelper } from 'src/app/core/helpers/string';
import { IPhotoDocument } from 'src/app/core/models/general/photo-document';
import { TakePictureModalComponent } from './take-picture-modal/take-picture-modal.component';

@Component({
    selector: 'app-take-pictures',
    templateUrl: './take-pictures.component.html',
    styleUrls: ['../../../assets/components/input.scss']
})
export class TakePicturesComponent {

    @Input()
    images: IPhotoDocument[] = [];

    @Input()
    readOnly = false;

    @Input()
    title: string;

    @Output()
    imagesEvent = new EventEmitter<IPhotoDocument[]>();

    constructor(
        private modalController: ModalController
    ) { }

    isEmptyOrNull = (value: string) => StringHelper.isEmptyOrNull(value);

    removePicture(index: number) {
        this.images.splice(index, 1);
        this.imagesEvent.emit(this.images);
    }

    addPhoto() {
        const data = {
            readonly: false,
            title: 'TITLES.PICTURE'
        };
        DialogHelper.openDialog(this.modalController, TakePictureModalComponent, data).then(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.images.push(result);
                this.imagesEvent.emit(this.images);
            }
        });
    }

    viewPhoto(index: number) {
        const data = {
            photoDocument: this.images[index],
            readonly: true,
            title: 'TITLES.PICTURE'
        };
        DialogHelper.openDialog(this.modalController, TakePictureModalComponent, data);
    }

}
