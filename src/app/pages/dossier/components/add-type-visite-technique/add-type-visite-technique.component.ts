import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { VisteTechniqueType } from 'src/app/core/enums/viste-technique-type.enum';

@Component({
  selector: 'app-add-type-visite-technique',
  templateUrl: './add-type-visite-technique.component.html'
})
export class AddTypeVisiteTechniqueComponent {

  /** the type of visite technique enumeration */
  visteTechniqueType = VisteTechniqueType;
  selectedType: VisteTechniqueType;

  constructor(
    public modalController: ModalController,
  ) {
  }

  save() {
    this.modalController.dismiss(this.selectedType);
  }

}
