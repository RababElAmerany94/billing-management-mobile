import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IDropDownItem } from 'src/app/core/models/general/drop-down-item.model';
import { ConversionHelper } from 'src/app/core/helpers/conversion';
import { PrestationType } from 'src/app/core/enums/prestation-type.enum';
import { IUser } from '../../../../core/models/user/userModel';
import { ModalController } from '@ionic/angular';
import { IPhotoDocument } from 'src/app/core/models/general/photo-document';

@Component({
    selector: 'app-information-fiche-controle',
    templateUrl: './information-fiche-controle.component.html',
    styleUrls: ['../../../../../assets/components/input.scss']
})
export class InformationFicheControleComponent {

    @Output()
    imagesEvent = new EventEmitter<IPhotoDocument[]>();

    @Output()
    userEvent = new EventEmitter<IUser>();

    @Input()
    form: FormGroup;

    @Input()
    readOnly: false;

    @Input()
    set Photos(value: IPhotoDocument[]) {
        if (value != null) {
            this.photos = value;
        }
    }

    @Input()
    controllerUser: IUser;

    photos: IPhotoDocument[] = [];
    prestationType: IDropDownItem<number, string>[] = [];

    constructor(
        public modalController: ModalController,
    ) {
        this.chargeDropDownPrestationType();
    }

    //#region helpers

    chargeDropDownPrestationType() {
        this.prestationType = ConversionHelper.convertEnumToListKeysValues(PrestationType, 'number');
        this.prestationType.forEach(e => e.text = `PRESTATION_TYPE.${e.value}`);
    }

    photosEvent(photos: IPhotoDocument[]) {
        this.photos = photos;
        this.imagesEvent.emit(photos);
    }

    //#endregion
}
