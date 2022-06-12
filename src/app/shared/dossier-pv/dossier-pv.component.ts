import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ResultStatus } from 'src/app/core/enums/result-status';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { FileHelper } from 'src/app/core/helpers/file';
import { JsonHelper } from 'src/app/core/helpers/json';
import { StringHelper } from 'src/app/core/helpers/string';
import { IDossierPV, IDossierPVModel } from 'src/app/core/models/dossier/dossierPVModel';
import { IFicheControle, IFicheControleModel } from 'src/app/core/models/dossier/ficheControleModel';
import { IArticle } from 'src/app/core/models/general/article.model';
import { IPhotoDocument } from 'src/app/core/models/general/photo-document';
import { FileManagerService } from 'src/app/core/services/file-manager/file-manager.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { IDossier } from 'src/app/pages/dossier/dossier.model';
import { DossierService } from 'src/app/pages/dossier/dossier.service';
import { BaseContainerComponent } from 'src/app/shared/base-features/base-container.component';
import { EditDossierPvComponent } from './edit-dossier-pv/edit-dossier-pv.component';
import { FicheControleComponent } from './fiche-controle/fiche-controle.component';

@Component({
    selector: 'app-dossier-pv',
    templateUrl: './dossier-pv.component.html',
    styleUrls: ['./../../../assets/components/card-content.scss']
})
export class DossierPvComponent extends BaseContainerComponent implements OnInit {

    @Output()
    refresh = new EventEmitter();

    @Input()
    set Dossier(value: IDossier) {
        this.dossier = value;
        if (this.dossier.pVs != null && this.dossier.pVs.length > 0) {
            this.dossierPV = this.dossier.pVs[0];
            this.articles = this.dossier.pVs[0].articles;
            this.ficheDeControle = this.dossier.pVs[0].ficheControle;
        } else {
            this.dossierPV = null;
            this.getArticlesPV();
        }
    }

    dossier: IDossier;
    dossierPV: IDossierPV;
    ficheDeControle: IFicheControle;
    articles: IArticle[] = [];

    constructor(
        private modalController: ModalController,
        private alertController: AlertController,
        protected translate: TranslateService,
        private dossierService: DossierService,
        private loadingService: LoadingService,
        protected toastService: ToastService,
        private fileService: FileManagerService,
        public router: Router,
        protected location: Location
    ) {
        super(toastService, translate, router, location);
    }

    ngOnInit() { }

    //#region opendialog

    /**
     * open dialog to add pv
     */
    addDossierPvDialog() {
        const data = {
            title: 'TABLE_PV.ADD',
            readOnly: false,
            articles: this.articles,
        };
        DialogHelper.openDialog(this.modalController, EditDossierPvComponent, data).then(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.addDossierPV(result);
            }
        });
    }

    /**
     * open dialog to delete pv
     */
    deleteDossierPV() {
        DialogHelper.presentAlert(this.alertController, this.translate,
            {
                headerText: this.translate.instant('TABLE_PV.DELETE.HEADER'),
                message: `${this.translate.instant('TABLE_PV.DELETE.MESSAGE')} : ${this.dossierPV.nameClientSignature} ?`,
                done: async () => this.deletePV(),
                cancel: () => null
            });
    }

    /**
     * open dialog to edit pv
     */
    editDossierPV() {
        const data = {
            title: 'TABLE_PV.EDIT',
            dossierPV: this.dossierPV,
            readOnly: false,
            articles: this.articles,
        };
        DialogHelper.openDialog(this.modalController, EditDossierPvComponent, data).then(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.updateDossierPV(result);
            }
        });
    }

    /**
     * open dialog to show pv
     */
    detailDossierPV() {
        const data = {
            title: 'TABLE_PV.SHOW',
            dossierPV: this.dossierPV,
            readOnly: true,
            articles: this.articles,
        };
        DialogHelper.openDialog(this.modalController, EditDossierPvComponent, data);
    }

    /**
     * open dialog to add fiche de controle
     */
    addFicheDeControleDialog() {
        const data = {
            title: 'TABLE_FICHE_DE_CONTROLE.ADD',
            readOnly: false,
        };
        DialogHelper.openDialog(this.modalController, FicheControleComponent, data).then(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.addFicheDeControle(result);
            }
        });
    }

    /**
     * open dialog to delete fiche de controle
     */
    deleteFicheDeControleDialog() {
        DialogHelper.presentAlert(this.alertController, this.translate,
            {
                headerText: this.translate.instant('TABLE_FICHE_DE_CONTROLE.DELETE.HEADER'),
                message: `${this.translate.instant('TABLE_FICHE_DE_CONTROLE.DELETE.MESSAGE')}
                            : ${this.ficheDeControle.nameClientSignature} ?`,
                done: async () => this.deleteFicheDeControle(),
                cancel: () => null
            });
    }

    /**
     * open dialog to edit fiche de controle
     */
    editFicheDeControle() {
        const data = {
            title: 'TABLE_FICHE_DE_CONTROLE.EDIT',
            ficheDeControle: this.ficheDeControle,
            readOnly: false,
        };
        DialogHelper.openDialog(this.modalController, FicheControleComponent, data).then(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.updateFicheDeControle(result);
            }
        });
    }

    /**
     * open dialog to delete fiche de controle
     */
    detailFicheDeControle() {
        const data = {
            title: 'TABLE_FICHE_DE_CONTROLE.SHOW',
            ficheDeControle: this.ficheDeControle,
            readOnly: true,
        };
        DialogHelper.openDialog(this.modalController, FicheControleComponent, data);
    }

    //#endregion

    //#region service

    /**
     * add dossier pv action
     */
    async addDossierPV(dossierPVModel: IDossierPVModel) {
        dossierPVModel.articles = this.articles;
        dossierPVModel.dossierId = this.dossier.id;
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        const photos = dossierPVModel.photos as IPhotoDocument[];
        FileHelper.uploadPhotos(this.fileService, photos,
            async (photosResult) => {
                dossierPVModel.photos = photosResult;
                this.dossierService.CreateDossierPV(dossierPVModel).subscribe(async result => {
                    if (result.hasValue) {
                        this.toastAddSuccess();
                        await this.loadingService.hide();
                        this.dossierPV = result.value;
                    } else {
                        this.toastErrorServer();
                        await this.loadingService.hide();
                    }
                }, async _ => await this.loadingService.hide());
            }, async () => {
                this.toastErrorServer();
                await this.loadingService.hide();
            });
    }

    /**
     * update dossier pv
     */
    async updateDossierPV(dossierPVModel: IDossierPVModel) {
        dossierPVModel.articles = this.articles;
        const id = this.dossierPV.id;
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        const photos = dossierPVModel.photos as IPhotoDocument[];
        FileHelper.uploadPhotos(this.fileService, photos,
            (photosResult) => {
                dossierPVModel.photos = photosResult;
                this.dossierService.UpdateDossierPV(id, dossierPVModel).subscribe(async result => {
                    await this.loadingService.hide();
                    if (result.hasValue) {
                        this.toastEditSuccess();
                        this.dossierPV = result.value;
                    } else {
                        this.toastErrorServer();
                    }
                }, async _ => await this.loadingService.hide());
            }, async () => {
                this.toastErrorServer();
                await this.loadingService.hide();
            });
    }

    /**
     * delete pv
     */
    async deletePV() {
        const id = this.dossierPV.id;
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        this.subs.sink = this.dossierService.DeleteDossierPV(id).subscribe(async result => {
            await this.loadingService.hide();
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.dossierPV = null;
                this.ficheDeControle = null;
            } else {
                this.toastErrorServer();
            }
        }, async _ => await this.loadingService.hide());
    }

    /**
     * get list artcle as paged
     * @param article display all article
     */
    getArticlesPV() {
        this.loading = true;
        this.dossierService.GetArticleDossierPV(this.dossier.id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.articles = result.value;
                this.loading = false;
            } else {
                this.toastErrorServer();
                this.loading = false;
            }
        });
    }

    /**
     * add fiche de controle
     */
    async addFicheDeControle(ficheControleModel: IFicheControleModel) {
        ficheControleModel.dossierPVId = this.dossierPV.id;
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        const photos = ficheControleModel.photos as IPhotoDocument[];
        FileHelper.uploadPhotos(this.fileService, photos,
            async (photosResult) => {
                ficheControleModel.photos = photosResult;
                this.dossierService.CreateFicheDeControle(ficheControleModel).subscribe(async result => {
                    await this.loadingService.hide();
                    if (result.hasValue) {
                        this.toastAddSuccess();
                        this.refresh.emit();
                    } else {
                        this.toastErrorServer();
                    }
                }, async _ => await this.loadingService.hide());
            },
            async () => {
                this.toastErrorServer();
                await this.loadingService.hide();
            });
    }

    /**
     * update fiche de controle
     */
    async updateFicheDeControle(ficheControleModel: IFicheControleModel) {
        const id = this.ficheDeControle.id;
        ficheControleModel.dossierPVId = this.dossierPV.id;
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        const photos = ficheControleModel.photos as IPhotoDocument[];
        FileHelper.uploadPhotos(this.fileService, photos,
            async (photosResult) => {
                ficheControleModel.photos = photosResult;
                this.dossierService.UpdateFicheDeControle(id, ficheControleModel).subscribe(async result => {
                    await this.loadingService.hide();
                    if (result.hasValue) {
                        this.toastEditSuccess();
                        this.refresh.emit();
                    } else {
                        this.toastErrorServer();
                    }
                }, async _ => await this.loadingService.hide());
            },
            async () => {
                this.toastErrorServer();
                await this.loadingService.hide();
            });
    }

    /**
     * delete fiche de controle
     */
    async deleteFicheDeControle() {
        const id = this.ficheDeControle.id;
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        this.subs.sink = this.dossierService.DeleteFicheDeControle(id).subscribe(async result => {
            await this.loadingService.hide();
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.ficheDeControle = null;
            } else {
                this.toastErrorServer();
            }
        }, async _ => await this.loadingService.hide());
    }

    //#endregion
}
