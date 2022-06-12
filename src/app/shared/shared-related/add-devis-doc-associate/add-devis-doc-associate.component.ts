import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { DevisType } from 'src/app/core/enums/devis-type.enum';

@Component({
    selector: 'app-add-devis-doc-associate',
    templateUrl: './add-devis-doc-associate.component.html',
})
export class AddDevisDocAssociateComponent {

    /** the type of devis enumeration */
    devisType = DevisType;

    /** the type of devis enumeration */
    selectedType: DevisType;

    /** the primeCEE of devis */
    isPrimeCEE = false;

    constructor(
        public modalController: ModalController,
        private navParams: NavParams
    ) {
        this.isPrimeCEE = this.navParams.get('isPrimeCEE');
    }

    save() {
        this.modalController.dismiss(this.selectedType);
    }

}
