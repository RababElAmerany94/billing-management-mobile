import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BonCommandeStatus } from 'src/app/core/enums/bon-commande-status.enum';
import { ClientType } from 'src/app/core/enums/client-type.enum';
import { DevisType } from 'src/app/core/enums/devis-type.enum';
import { Address } from 'src/app/core/models/general/address.model';
import { IDocumentAssociate } from 'src/app/core/models/general/documentAssociate.model';
import { IUser } from 'src/app/core/models/user/userModel';
import { ToastService, ToastTypes } from 'src/app/core/services/toast.service';
import { IDossier } from 'src/app/pages/dossier/dossier.model';
import { BaseDocumentsComponent } from 'src/app/shared/base-features/base-documents.component';
import { IBonCommande, IBonCommandeModel } from '../../bon-commande.model';
import { UserHelper } from 'src/app/core/helpers/user';
import { PopoverComponent } from 'src/app/shared/popover/popover.component';
import { IClient } from 'src/app/pages/clients/client.model';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { RaisonAnnulationComponent } from '../raison-annulation/raison-annulation.component';
import { SignatureBonCommandeComponent } from '../signature-bon-commande/signature-bon-commande.component';
import { StringHelper } from 'src/app/core/helpers/string';
import { BonCommandeHelper } from 'src/app/core/helpers/bon-commande';

@Component({
  selector: 'app-edit-bon-commande',
  templateUrl: './edit-bon-commande.component.html',
  styleUrls: [
    '../../../../../assets/components/input.scss',
    '../../../../../assets/components/grid.scss'],
})
export class EditBonCommandeComponent extends BaseDocumentsComponent<IBonCommandeModel>   {

  /** event download pdf bonCommande */
  @Output()
  downloadEvent = new EventEmitter();

  /** event print pdf bonCommande */
  @Output()
  printBonCommandeEvent = new EventEmitter();

  @Output()
  dupliquerEvent = new EventEmitter();

  @Output()
  markBonCommandeAnnulerEvent = new EventEmitter();

  @Output()
  signeBonCommandeEvent = new EventEmitter();

  /** transfer bon de commande to devis */
  @Output()
  transferToDevisEvent = new EventEmitter<IBonCommande>();

  /** set the bonCommande */
  @Input()
  set BonCommande(bonCommande: IBonCommande) {
    if (bonCommande != null) {
      this.siteIntervention = bonCommande.siteIntervention;
      this.selectedClient = bonCommande.client;
      this.selectedUser = bonCommande.user as IUser;
      this.bonCommande = bonCommande;
      this.articles = bonCommande.articles;
      this.currentStatus = bonCommande.status;
      this.relatedDocs = bonCommande.documentAssociates;
    }
    this.setDefaultUser();
  }

  /** set the type of bonCommande */
  @Input()
  set Type(type: DevisType) {
    if (type != null) {
      this.currentType = type;
    }
  }

  /** set the dossier of bonCommande */
  @Input()
  set Dossier(dossier: IDossier) {
    if (dossier != null) {
      this.dossier = dossier;
      this.setDefaultUser();
      this.form.get('clientId').setValue(this.dossier.clientId);
    }
  }

  /** the site intervention */
  siteIntervention: Address;

  /** the enumeration status of bonCommande */
  status = BonCommandeStatus;

  /** the current status of bonCommande in edit and show */
  currentStatus: BonCommandeStatus;

  /** the current bonCommande to modify */
  bonCommande: IBonCommande;

  /** the current type of bonCommande */
  currentType: DevisType;

  /** the type of the */
  bonCommandeType = DevisType;

  /** the dossier of bonCommande */
  dossier: IDossier;

  /** the enumeration of client types */
  clientType = ClientType;

  /** current selected client  */
  selectedUser: IUser;

  /** related documents */
  relatedDocs: IDocumentAssociate[] = [];

  constructor(
    public router: Router,
    private translate: TranslateService,
    private toastService: ToastService,
    public modalController: ModalController,
    public popoverCtrl: PopoverController,
    public navCtrl: NavController,
    public location: Location,
  ) {
    super(modalController, navCtrl, router, location);
  }

  //#region save changes

  /**
   * save changes
   */
  async save(status: BonCommandeStatus) {
    const bonCommande = this.buildBonCommandeObject(status);
    if (this.isEditMode()) {
      this.editEvent.emit(bonCommande);
    } else {
      this.addEvent.emit(bonCommande);
    }
  }

  /**
   * save Changes
   */
  async saveBase(status: BonCommandeStatus, type: boolean) {
    if (this.form.valid) {
      if (type === true) {
        const result = await this.openSignatureDialog();
        if (result == null || result === '') {
          return;
        } else {
          this.form.value.dateSignature = result.dateSignature;
          this.form.value.signe = result.signe;
          this.form.value.nameClientSignature = result.nameClientSignature;
          this.save(status);
        }
      } else {
        this.save(status);
      }
    } else {
      this.toastService.presentToast({ message: this.translate.instant('ERRORS.FILL_ALL'), type: ToastTypes.Danger });
      this.form.markAllAsTouched();
    }
  }

  //#endregion

  //#region dialog

  /**
   * open signature dialog
   */
  async openSignatureDialog() {
    const modal = await this.modalController.create({
      component: SignatureBonCommandeComponent,
      componentProps: {},
      animated: true
    });
    modal.present();
    return modal.onDidDismiss().then((result) => {
      return result.data;
    });
  }

  //#endregion

  //#region helpers

  /**
   * build dossier object
   */
  buildBonCommandeObject(status: BonCommandeStatus): IBonCommandeModel {
    const bonCommandeModel: IBonCommandeModel = { ...this.form.value };

    bonCommandeModel.status = status;

    if (this.siteIntervention != null) {
      bonCommandeModel.siteIntervention = this.siteIntervention;
    }

    bonCommandeModel.totalReduction = this.resultCalculation.totalReduction;
    bonCommandeModel.totalPaid = this.resultCalculation.totalPaid;
    bonCommandeModel.totalTTC = this.resultCalculation.totalTTC;

    bonCommandeModel.articles = this.resultCalculation.articles;
    bonCommandeModel.totalHT = this.resultCalculation.remise > 0 ? this.resultCalculation.totalHTRemise : this.resultCalculation.totalHT;

    if (UserHelper.isFollowAgence()) {
      bonCommandeModel.agenceId = UserHelper.getAgenceId();
    }

    if (this.currentType != null) {
      bonCommandeModel.type = this.currentType;
    } else {
      bonCommandeModel.type = DevisType.Normal;
    }

    if (this.dossier != null) {
      bonCommandeModel.dossierId = this.dossier.id;
      bonCommandeModel.clientId = this.dossier.clientId;
      bonCommandeModel.siteIntervention = this.dossier.siteIntervention;
    } else {
      bonCommandeModel.clientId = this.selectedClient.id;
    }

    return bonCommandeModel;
  }

  async saveBonCommande() {
    if (this.form.valid) {
      const popover = await this.popoverCtrl.create({
        component: PopoverComponent,
        componentProps: {
          items: [
            {
              text: this.translate.instant('STATUS.ENCOURS'),
              icon: 'analytics-outline',
              action: () => this.saveBase(BonCommandeStatus.EnCours, true),
              appear: true
            },
            {
              text: this.translate.instant('STATUS.VALIDE'),
              icon: 'create-outline',
              action: () => this.saveBase(BonCommandeStatus.EnCours, false),
              appear: true
            }
          ]
        },
        event,
        translucent: false
      });
      return await popover.present();
    } else {
      this.form.markAllAsTouched();
      this.toastService.presentToast({ message: this.translate.instant('ERRORS.FILL_ALL'), type: ToastTypes.Danger });
    }
  }

  /**
   * more actions
   */
  async onMoreClick() {
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      componentProps: {
        items: [
          {
            text: this.translate.instant('LABELS.DOWNLOAD'),
            icon: 'download-outline',
            action: () => this.downloadPdf(),
            appear: this.isShowMode()
          },
          {
            text: this.translate.instant('LABELS.IMPRIMER'),
            icon: 'print-outline',
            action: () => this.printPdf(),
            appear: this.isShowMode()
          },
          {
            text: this.translate.instant('LABELS.DUPLIQUER'),
            icon: 'add-outline',
            action: () => this.dupliquerEvent.emit(this.bonCommande),
            appear: this.isShowMode()
          },
          {
            text: this.translate.instant('LABELS.TRANSFER_BON_COMMANDE'),
            icon: 'analytics-outline',
            action: () => this.transferBonCommandeToDevis(),
            appear: BonCommandeHelper.canTransferToDevis(this.currentStatus),
          },
          {
            text: this.translate.instant('STATUS.ANNULE'),
            icon: 'trash-outline',
            action: () => this.annuleeBonCommande(),
            appear: this.isShowMode() && !BonCommandeHelper.canAnnuler(this.currentStatus),
          },
          {
            text: this.translate.instant('EMAILS.SEND'),
            icon: 'send-outline',
            action: () => this.sendEmail({
              emails: this.bonCommande.emails ? this.bonCommande.emails : [],
              contacts: this.bonCommande.client.contacts,
              type: this.bonCommande,
              canRevive: false
            }, (result) => {
              if (result != null) {
                this.SendEmailEvent.emit(result);
              }
            }),
            appear: this.isShowMode()
          }
        ]
      },
      event,
      translucent: false
    });
    return await popover.present();
  }
  //#endregion

  //#region setters views

  /**
   * set site d'intervention
   */
  setSiteIntervention(address: Address) {
    this.siteIntervention = address;
  }

  /** select client */
  async chooseClient(client: IClient) {
    this.selectedClient = client;
    if (this.selectedClient.commercial && this.isAddMode()) {
      this.selectedUser = this.selectedClient.commercial;
    }
  }

  /** display title  */
  displayTitle() {
    return this.isNavigationRoute && this.isEditMode() ? 'SHOW.TITLE' : this.displayHeaderTitle();
  }

  /**
   * annuler bon commande
   */
  annuleeBonCommande() {
    DialogHelper
      .openDialog(this.modalController, RaisonAnnulationComponent, null)
      .then(result => {
        if (!StringHelper.isEmptyOrNull(result)) {
          this.bonCommande.raisonAnnulation = result.raisonAnnulation;
          this.markBonCommandeAnnulerEvent.emit(this.bonCommande);
        }
      });
  }

  /** transfer bonCommande to facture */
  transferBonCommandeToDevis() {
    this.transferToDevisEvent.emit(this.bonCommande);
  }

  //#endregion

  //#region helpers

  isContactCOMPANY() {
    return this.currentType !== this.bonCommandeType.Normal;
  }

  private setDefaultUser() {
    if (this.isAddMode()) {
      this.selectedUser = UserHelper.getCurrentUser();
    }
  }

  //#endregion

}
