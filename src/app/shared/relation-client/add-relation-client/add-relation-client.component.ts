import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ResultStatus } from 'src/app/core/enums/result-status';
import { ClientRelationType } from 'src/app/core/enums/type-relation-client.enum';
import { ConversionHelper } from 'src/app/core/helpers/conversion';
import { IClientRelation } from 'src/app/core/models/general/client-relation.model';
import { IDropDownItem } from 'src/app/core/models/general/drop-down-item.model';
import { ToastService, ToastTypes } from 'src/app/core/services/toast.service';
import { IClient } from 'src/app/pages/clients/client.model';
import { ClientsService } from 'src/app/pages/clients/client.service';

@Component({
  selector: 'app-add-relation-client',
  templateUrl: './add-relation-client.component.html',
})
export class AddRelationClientComponent implements OnInit {

  /** form group of relation client attributes */
  form: FormGroup;

  /** the title of modal */
  title: string;

  /** type relation client status */
  typeRelationClient: IDropDownItem<number, string>[] = [];

  clientRelation: IClientRelation;

  /** current selected client */
  selectedClient: IClient;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private toastService: ToastService,
    private navParams: NavParams,
    private clientsService: ClientsService,
    private modalController: ModalController
  ) {
    this.initialization();
    this.clientRelation = this.navParams.get('clientRelation');
    this.title = this.navParams.get('title');
    if (this.clientRelation != null) {
      this.setDataInForm(this.clientRelation);
    }
    this.chargetypeRelationClient();
  }

  ngOnInit(): void {
    this.getClientById(this.clientRelation && this.clientRelation.clientId);
  }

  initialization() {
    this.form = this.fb.group({
      clientId: [null, [Validators.required]],
      type: [null, [Validators.required]],
    });
  }

  setDataInForm(client: IClientRelation) {
    this.form.setValue({
      clientId: client.clientId,
      type: client.type
    });
  }

  /** save client Relation */
  save() {
    if (this.form.valid) {
      const values = this.form.getRawValue();
      values.client = this.selectedClient;
      this.modalController.dismiss(values);
    } else {
      this.toastService.presentToast({ message: this.translate.instant('ERRORS.FILL_ALL'), type: ToastTypes.Danger });
      this.form.markAllAsTouched();
    }
  }

  /** dismiss modal controller */
  async dismiss() {
    await this.modalController.dismiss();
  }

  //#region helpers

  /**
   * charge type Relation Client
   */
  chargetypeRelationClient() {
    this.typeRelationClient = ConversionHelper.convertEnumToListKeysValues(ClientRelationType, 'number');
    this.typeRelationClient.forEach(e => e.text = `CLIENT_RELATION_TYPE.${e.value}`);
  }

  /**
   * get client by id
   * @param id the id of entity client
   */
  getClientById(id: string) {
    if (id) {
      this.clientsService.Get(id).subscribe(result => {
        if (result.status === ResultStatus.Succeed) {
          this.selectedClient = result.value;
        } else {
          this.toastService.presentToast({
            message: this.translate.instant('ERRORS.SERVER'),
            type: ToastTypes.Danger
          });
        }
      });
    }
  }

  /**
   * select client
   */
  async changeClient(result: IClient) {
    this.selectedClient = result;
  }
  //#endregion
}
