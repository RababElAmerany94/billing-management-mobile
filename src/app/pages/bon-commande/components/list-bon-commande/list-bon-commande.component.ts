import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BonCommandeStatus } from 'src/app/core/enums/bon-commande-status.enum';
import { BonCommandeHelper } from 'src/app/core/helpers/bon-commande';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { StringHelper } from 'src/app/core/helpers/string';
import { IPagedResult } from 'src/app/core/models/general/result-model';
import { BaseListComponent } from 'src/app/shared/base-features/base-list.component';
import { IBonCommande, IBonCommandeDataList } from '../../bon-commande.model';
import { RaisonAnnulationComponent } from '../raison-annulation/raison-annulation.component';

@Component({
  selector: 'app-list-bon-commande',
  templateUrl: './list-bon-commande.component.html',
  styleUrls: ['../../../../../assets/components/lists.scss'],
})
export class ListBonCommandeComponent extends BaseListComponent<IBonCommande, number> {

  @Output()
  markBonCommandeAnnulerEvent = new EventEmitter<IBonCommande>();

  /** transfer bon de commande to devis */
  @Output()
  transferToDevisEvent = new EventEmitter<IBonCommande>();

  @Input()
  set data(data: IPagedResult<IBonCommande>) {
    if (data != null) {
      this.bonCommandePagedResult = { ...data as IPagedResult<any> };
      this.bonCommande = data.value;
      this.bonCommandeList = data.value.map<IBonCommandeDataList>(e => this.mapIBonCommandeIntoIBonCommandeDataList(e));
    }
  }

  /** list dossiers */
  bonCommandeList: IBonCommandeDataList[];

  /** list bonCommandes */
  bonCommande: IBonCommande[];

  /** list of bonCommande */
  bonCommandePagedResult: IPagedResult<IBonCommande>;

  /** status of bonCommande */
  bonCommandeStatus = BonCommandeStatus;

  constructor(
    public translate: TranslateService,
    public modalController: ModalController,
    private alertController: AlertController
  ) {
    super();
    this.setModule(this.modules.BonCommande);
  }
  //#region events

  /**
   * delete click
   */
  deleteClick(index: string) {
    const bonCommandee = this.bonCommande[index];
    DialogHelper.presentAlert(
      this.alertController,
      this.translate,
      {
        headerText: this.translate.instant('LIST.DELETE.HEADER'),
        message: this.translate.instant('LIST.DELETE.MESSAGE') + ':' + bonCommandee.reference.toUpperCase() + ' ? ',
        done: async () => {
          this.deleteEvent.emit(bonCommandee.id);
        },
        cancel: () => { }
      }
    );
  }

  /**
   * annuler bon commande
   */
  annuleeBonCommande(id: string) {
    const index = this.bonCommande.findIndex(x => x.id === id);
    DialogHelper.openDialog(this.modalController, RaisonAnnulationComponent, null).then(result => {
      if (!StringHelper.isEmptyOrNull(result)) {
        this.bonCommande[index].raisonAnnulation = result.raisonAnnulation;
        this.markBonCommandeAnnulerEvent.emit(this.bonCommande[index]);
      }
    });
  }

  /** transfer bonCommande to facture */
  transferBonCommandeToDevis(id: string) {
    this.transferToDevisEvent.emit(this.bonCommande.filter(x => x.id === id)[0]);
  }

  /** map bonCommande to bonCommande dataList model */
  mapIBonCommandeIntoIBonCommandeDataList(bonCommande: IBonCommande): IBonCommandeDataList {
    const bonCommandeDataList: IBonCommandeDataList = {
      id: bonCommande.id,
      reference: bonCommande.reference,
      clientId: bonCommande.client.fullName,
      dateVisit: bonCommande.dateVisit,
      type: bonCommande.type,
      status: bonCommande.status,
      canModify: BonCommandeHelper.canEditOrDelete(bonCommande.status)
    };

    return bonCommandeDataList;
  }

  //#endregion

  //#region helper

  getStatus(status: BonCommandeStatus) {
    return `BON_COMMANDE_STATUS.${status}`;
  }

  /**
   * can bon de commande be annulee
   */
  canCancel = (status) => !BonCommandeHelper.canAnnuler(status);

  /**
   * can bon de commande be transfered
   */
  canTransfer = (status) => BonCommandeHelper.canTransferToDevis(status);

  //#endregion

}
