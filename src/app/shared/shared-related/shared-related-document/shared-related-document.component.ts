import { Component, Input } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, ModalController, NavController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DevisStatus } from 'src/app/core/enums/devis-status.enum';
import { DevisType } from 'src/app/core/enums/devis-type.enum';
import { DocType } from 'src/app/core/enums/doctype.enums';
import { ModeEnum } from 'src/app/core/enums/mode.enum';
import { RouteName } from 'src/app/core/enums/route.enum';
import { BonCommandeHelper } from 'src/app/core/helpers/bon-commande';
import { DevisHelper } from 'src/app/core/helpers/devis';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { StringHelper } from 'src/app/core/helpers/string';
import { ToastService } from 'src/app/core/services/toast.service';
import { DevisSignatureModel } from 'src/app/pages/devis/devis.model';
import { IDocumentAssociateModel, IDossier } from 'src/app/pages/dossier/dossier.model';
import { PopoverComponent } from '../../popover/popover.component';
import { ValidationDevisComponent } from '../../validation-devis/validation-devis.component';
import { AddDevisDocAssociateComponent } from '../add-devis-doc-associate/add-devis-doc-associate.component';

@Component({
    selector: 'app-shared-related-document',
    templateUrl: './shared-related-document.component.html',
    styleUrls: ['../../../../assets/components/lists.scss']
})
export class SharedRelatedDocumentComponent {

    @Input()
    set data(value: IDocumentAssociateModel[]) {
        if (value != null) {
            this.items = value;
        }
    }

    @Input()
    dossier: IDossier;

    @Input()
    readOnly = false;

    /** related docs types */
    docType = DocType;

    /** list of related docs */
    items: IDocumentAssociateModel[];

    /** the status of devis */
    devisStatus = DevisStatus;

    /** the model of signature devis */
    devisSignatureModel: DevisSignatureModel;

    navigationExtras: NavigationExtras;

    constructor(
        private translate: TranslateService,
        public alertController: AlertController,
        public modalController: ModalController,
        private router: Router,
        protected toastService: ToastService,
        public popoverCtrl: PopoverController,
        public navCtrl: NavController
    ) { }

    /**
     * show document associate
     * @param index the index of doc associate in the doc associate
     */
    showDocumentAssociate(index: number) {
        const document = this.items[index];
        switch (document.type) {
            case this.docType.Devis:
                this.navigationExtras = {
                    queryParams: {
                        mode: ModeEnum.Show,
                        id: document.id,
                        isNavigationRoute: true
                    }
                };
                this.router.navigate([`/${RouteName.Devis}`], this.navigationExtras);
                break;

            case this.docType.BonCommande:
                this.navigationExtras = {
                    queryParams: {
                        mode: ModeEnum.Show,
                        id: document.id,
                        isNavigationRoute: true
                    }
                };
                this.router.navigate([`/${RouteName.BonCommande}`], this.navigationExtras);
                break;

            default:
                break;
        }
    }

    /**
     * delete doc associate by index
     * @param index the index of doc associate in the doc associate
     */
    deleteDocumentAssociate(index: number, type: DocType) {
        const name = type === this.docType.Devis ? 'DEVIS_DELETE' : 'BON_COMMANDE_DELETE';
        const document = this.items[index];
        DialogHelper.presentAlert(
            this.alertController,
            this.translate,
            {
                headerText: this.translate.instant(`LIST.${name}.HEADER`),
                message: `${this.translate.instant(`LIST.${name}.MESSAGE`)}: ${document.reference.toUpperCase()} ?`,
                done: async () => {
                    const navigationExtras: NavigationExtras = {
                        queryParams: {
                            mode: ModeEnum.Delete,
                            id: this.items[index].id,
                            isNavigationRoute: true
                        }
                    };
                    type === this.docType.Devis ?
                        this.router.navigate([`/${RouteName.Devis}`], navigationExtras) :
                        this.router.navigate([`/${RouteName.BonCommande}`], navigationExtras);
                },
                cancel: () => { }
            }
        );
    }

    /**
     * edit document associate by index
     * @param index the index of document associate
     */
    editDocumentAssociate(index: number, type: DocType) {
        switch (type) {

            case this.docType.Devis:
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        mode: ModeEnum.Edit,
                        id: this.items[index].id,
                        isNavigationRoute: true
                    }
                };
                this.router.navigate([`/${RouteName.Devis}`], navigationExtras);
                break;

            case this.docType.BonCommande:
                this.navigationExtras = {
                    queryParams: {
                        mode: ModeEnum.Edit,
                        id: this.items[index].id,
                        isNavigationRoute: true,
                    }
                };
                this.router.navigate([`/${RouteName.BonCommande}`], this.navigationExtras);
                break;
        }
    }

    /**
     * sign doc associate by index
     * @param index the index of doc associate in the doc associate
     */
    async signDevis(index: number) {
        const result = await this.openSignatureDialog();

        if (StringHelper.isEmptyOrNull(result)) {
            return;
        } else {
            this.devisSignatureModel = {
                devisId: this.items[index].id,
                nameClientSignature: result.nameClientSignature,
                signe: result.signe
            };
        }

        const navigationExtras: NavigationExtras = {
            state: {
                devisSignatureModel: this.devisSignatureModel,
            },
            queryParams: {
                mode: ModeEnum.Signe,
                isNavigationRoute: true
            }
        };
        this.router.navigate([`/${RouteName.Devis}`], navigationExtras);
    }

    /**
     * add doc associate by index
     * @param id the index of doc associate in the doc associate
     */
    navigateAddDevis(devisType: DevisType) {
        const navigationExtras: NavigationExtras = {
            state: {
                type: devisType,
                dossier: this.dossier
            },
            queryParams: {
                mode: ModeEnum.Add,
                isNavigationRoute: true
            }
        };
        this.router.navigate([`/${RouteName.Devis}`], navigationExtras);
    }

    /**
     * add doc associate by index
     * @param id the index of doc associate in the doc associate
     */
    navigateAddBonDeCommande(devisType: DevisType) {
        const navigationExtras: NavigationExtras = {
            state: {
                type: devisType,
                dossier: this.dossier
            },
            queryParams: {
                mode: ModeEnum.Add,
                isNavigationRoute: true
            }
        };
        this.router.navigate([`/${RouteName.BonCommande}`], navigationExtras);
    }

    //#region dialog

    /**
     * open signature dialog
     */
    async openSignatureDialog() {
        const modal = await this.modalController.create({
            component: ValidationDevisComponent,
            componentProps: {},
            animated: true
        });
        modal.present();
        return modal.onDidDismiss().then((result) => {
            return result.data;
        });
    }

    /**
     * add related documents
     */
    addRelatedDocs(type: DocType) {
        const data = {
            isPrimeCEE: this.dossier.primeCEEId != null
        };
        DialogHelper.openDialog(this.modalController, AddDevisDocAssociateComponent, data).then((result) => {
            if (!StringHelper.isEmptyOrNull(result)) {
                if (type === DocType.BonCommande) {
                    this.navigateAddBonDeCommande(result as DevisType);
                } else if (type === DocType.Devis) {
                    this.navigateAddDevis(result as DevisType);
                }
            }
        });
    }

    /**
     * open choice type bon de commande or devis
     */
    async openChoiceByType() {

        const popover = await this.popoverCtrl.create({
            component: PopoverComponent,
            componentProps: {
                items: [
                    {
                        text: this.translate.instant('LABELS.ADD_BON_COMMANDE'),
                        icon: 'create-outline',
                        action: () => this.addRelatedDocs(this.docType.BonCommande),
                        appear: true
                    },
                    {
                        text: this.translate.instant('LABELS.ADD_DEVIS'),
                        icon: 'receipt-outline',
                        action: () => this.addRelatedDocs(this.docType.Devis),
                        appear: true
                    }
                ]
            },
            event,
            translucent: false
        });

        return await popover.present();
    }

    //#endregion

    //#region helpers

    /**
     * can edit document associate
     */
    canEdit(document: IDocumentAssociateModel) {
        switch (document.type) {
            case DocType.Devis:
                return DevisHelper.canEdit(document.status);

            case DocType.BonCommande:
                return BonCommandeHelper.canEditOrDelete(document.status);

            default:
                return true;
        }
    }

    /**
     * can delete document associate
     */
    canDelete(document: IDocumentAssociateModel) {
        switch (document.type) {
            case DocType.Devis:
                return DevisHelper.canEdit(document.status);

            case DocType.BonCommande:
                return BonCommandeHelper.canEditOrDelete(document.status);

            default:
                return true;
        }
    }

    //#endregion
}
