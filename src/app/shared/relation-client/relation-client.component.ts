import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ModeEnum } from 'src/app/core/enums/mode.enum';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { StringHelper } from 'src/app/core/helpers/string';
import { IClientRelationModel } from 'src/app/core/models/general/client-relation.model';
import { AddRelationClientComponent } from './add-relation-client/add-relation-client.component';

@Component({
  selector: 'app-relation-client',
  templateUrl: './relation-client.component.html',
  styleUrls: ['./../../../assets/components/card-content.scss']
})
export class RelationClientComponent {

  @Output()
  changeRelationClient = new EventEmitter();

  @Input()
  clientRelation: IClientRelationModel[] = [];

  @Input()
  mode: ModeEnum;

  @Input()
  title = 'RELATION_CLIENT.TITLE';

  modes = ModeEnum;

  constructor(
    public modalController: ModalController,
    public translate: TranslateService,
    public alertController: AlertController
  ) { }


  /**
   * open add clientRelation dialog
   */
  addclientRelationDialog(): void {
    const data = { title: 'RELATION_CLIENT.ADD_RELATION_CLIENT', showIsDefault: true };
    DialogHelper.openDialog(this.modalController, AddRelationClientComponent, data).then(result => {
      if (!StringHelper.isEmptyOrNull(result)) {
        this.clientRelation.push(result);
        this.emitChange();
      }
    });
  }

  /**
   * open edit clientRelation dialog
   * @param index the index of clientRelation to edit
   */
  editclientRelationDialog(index: number) {
    const data = {
      clientRelation: this.clientRelation[index],
      showIsDefault: true,
      title: 'RELATION_CLIENT.EDIT_RELATION_CLIENT',
    };
    DialogHelper.openDialog(this.modalController, AddRelationClientComponent, data).then(result => {
      if (!StringHelper.isEmptyOrNull(result)) {
        this.clientRelation[index] = result;
        this.emitChange();
      }
    });
  }

  /**
   * delete clientRelation by index
   * @param index the index of clientRelation to delete
   */
  deleteclientRelation(index: number) {
    DialogHelper.presentAlert(
      this.alertController,
      this.translate,
      {
        headerText: this.translate.instant('RELATION_CLIENT.DELETE.HEADER_TEXT'),
        message: this.translate.instant('RELATION_CLIENT.DELETE.QUESTION'),
        done: async () => {
          this.clientRelation.splice(index, 1);
          this.emitChange();
        },
        cancel: () => {
        }
      }
    );
  }

  /**
   * emit changes
   */
  emitChange() {
    this.changeRelationClient.emit(this.clientRelation);
  }

  //#endregion

}
