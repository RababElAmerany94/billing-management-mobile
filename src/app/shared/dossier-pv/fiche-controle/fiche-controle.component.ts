import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { IFicheControleModel, IFicheControle } from 'src/app/core/models/dossier/ficheControleModel';
import { IConstatCombles } from 'src/app/core/models/general/constat-combles.model';
import { IConstatMurs } from 'src/app/core/models/general/constat-murs.model';
import { IConstatPlanchers } from 'src/app/core/models/general/constat-planchers.model';
import { ToastService, ToastTypes } from 'src/app/core/services/toast.service';
import { SignFicheControleComponent } from './sign-fiche-controle/sign-fiche-controle.component';
import { StringHelper } from 'src/app/core/helpers/string';
import { IUser } from '../../../core/models/user/userModel';
import { IPhotoDocument } from 'src/app/core/models/general/photo-document';

@Component({
    selector: 'app-fiche-controle',
    templateUrl: './fiche-controle.component.html',
    styleUrls: ['../../../../assets/components/input.scss'],
})
export class FicheControleComponent {

    form: FormGroup;
    formConstatComble: FormGroup;
    formConstatMurs: FormGroup;
    formConstatPlanchers: FormGroup;

    photos: IPhotoDocument[] = [];
    readOnly = false;
    title: string;
    signatureClient: string;
    signatureController: string;
    nameClientSignature: string;

    ficheDeControle: IFicheControleModel;
    constatComble: IConstatCombles;
    constatMurs: IConstatMurs;
    constatPlanchers: IConstatPlanchers;

    controllerUser: IUser;

    constructor(
        private fb: FormBuilder,
        private modalController: ModalController,
        private translate: TranslateService,
        private toastService: ToastService,
        private navParams: NavParams
    ) {
        this.initializeForm();
        this.initFormConstatComble();
        this.initFormConstatMurs();
        this.initFormConstatPlanchers();
        this.title = this.navParams.get('title');
        this.readOnly = this.navParams.get('readOnly');
        this.setForm(this.navParams.get('ficheDeControle'));
    }

    /** initialize form */
    initializeForm() {
        this.form = this.fb.group({
            numberOperation: [null, [Validators.required]],
            prestationType: [null, [Validators.required]],
            dateControle: [null, [Validators.required]],
            remarques: [null],
            evaluationAccompagnement: [3],
            evaluationTravauxRealises: [3],
            evaluationPropreteChantier: [3],
            evaluationContactAvecTechniciensApplicateurs: [3],
            controllerId: [null, [Validators.required]],
        });
    }

    initFormConstatComble() {
        this.formConstatComble = this.fb.group({
            surfaceIsolantPrevue: [null],
            posteType: [null],
            trappeVisiteIsolee: [null],
            surfaceIsolantPose: [null],
            presencePigeReperageHauteurIsolant: [null],
            presenceProtectionPointsLumineuxTypeSpots: [null],
            conclusionEpaisseur: [null],
            homogeneiteCoucheIsolant: [null],
            presenceEcartAuFeuOuConduitsEvacuationFumees: [null],
            reperageBoitesElectriques: [null],
            rehausseOuProtectionInstallationsElectriques: [null],
            surfaceIsolantRetenue: [null],
            surfaceEstimeDepuis: [null],
            presenceCoffrageTrappeVisite: [null],
            epaisseurMesuree: [null],
            isEcartSurfacePrevueAndPoseOk: [false],
        });
    }

    initFormConstatMurs() {
        this.formConstatMurs = this.fb.group({
            surfaceIsolantPrevue: [null],
            surfaceIsolantPose: [null],
            isPoseCorrecteIsolant: [false],
            ecartAutourPointsEclairage: [null],
            ecartAutourBoitiersElectrique: [null],
            ecartAuFeuAutourFumees: [null],
            presenceFilsNonGainesNoyesDansIsolant: [null],
            conclusionIsolationMurs: [false],
        });
    }

    initFormConstatPlanchers() {
        this.formConstatPlanchers = this.fb.group({
            surfaceIsolantPrevue: [null],
            surfaceIsolantPose: [null],
            isPoseCorrecteIsolant: [false],
            ecartAutourPointsEclairage: [null],
            ecartAutourBoitiersElectrique: [null],
            ecartAuFeuAutourFumees: [null],
            presenceFilsNonGainesNoyesDansIsolant: [null],
            conclusionIsolationPlanchers: [false]
        });
    }

    /**
     * set constat comble
     */
    setForm(ficheDC: IFicheControle) {
        if (ficheDC != null) {
            this.form.patchValue({
                numberOperation: ficheDC.numberOperation,
                prestationType: ficheDC.prestationType,
                dateControle: ficheDC.dateControle,
                remarques: ficheDC.remarques,
                evaluationAccompagnement: ficheDC.evaluationAccompagnement,
                evaluationTravauxRealises: ficheDC.evaluationTravauxRealises,
                evaluationPropreteChantier: ficheDC.evaluationPropreteChantier,
                evaluationContactAvecTechniciensApplicateurs: ficheDC.evaluationContactAvecTechniciensApplicateurs,
                controllerId: ficheDC.controller.id,
            });
            this.controllerUser = ficheDC.controller;
            this.constatComble = ficheDC.constatCombles;
            this.constatMurs = ficheDC.constatMurs;
            this.constatPlanchers = ficheDC.constatPlanchers;
            this.photos = ficheDC.photos;
            this.signatureClient = ficheDC.signatureClient;
            this.signatureController = ficheDC.signatureController;
            this.nameClientSignature = ficheDC.nameClientSignature;
            this.setConstatComble(this.constatComble);
            this.setConstatMurs(this.constatMurs);
            this.setConstatPlanchers(this.constatPlanchers);
        }
        if (this.readOnly === true) {
            this.form.disable();
            this.formConstatComble.disable();
            this.formConstatMurs.disable();
            this.formConstatPlanchers.disable();
        }
    }

    /**
     * set constat comble
     */
    setConstatComble(constat: IConstatCombles) {
        this.formConstatComble.patchValue({
            surfaceIsolantPrevue: constat.surfaceIsolantPrevue,
            posteType: constat.posteType,
            trappeVisiteIsolee: constat.trappeVisiteIsolee,
            surfaceIsolantPose: constat.surfaceIsolantPose,
            presencePigeReperageHauteurIsolant: constat.presencePigeReperageHauteurIsolant,
            presenceProtectionPointsLumineuxTypeSpots: constat.presenceProtectionPointsLumineuxTypeSpots,
            conclusionEpaisseur: constat.conclusionEpaisseur,
            homogeneiteCoucheIsolant: constat.homogeneiteCoucheIsolant,
            presenceEcartAuFeuOuConduitsEvacuationFumees: constat.presenceEcartAuFeuOuConduitsEvacuationFumees,
            reperageBoitesElectriques: constat.reperageBoitesElectriques,
            rehausseOuProtectionInstallationsElectriques: constat.rehausseOuProtectionInstallationsElectriques,
            surfaceIsolantRetenue: constat.surfaceIsolantRetenue,
            surfaceEstimeDepuis: constat.surfaceEstimeDepuis,
            presenceCoffrageTrappeVisite: constat.presenceCoffrageTrappeVisite,
            epaisseurMesuree: constat.epaisseurMesuree,
            isEcartSurfacePrevueAndPoseOk: constat.isEcartSurfacePrevueAndPoseOk,
        });
    }

    /**
     * set constat murs
     */
    setConstatMurs(constat: IConstatMurs) {
        this.formConstatMurs.patchValue({
            surfaceIsolantPrevue: constat.surfaceIsolantPrevue,
            surfaceIsolantPose: constat.surfaceIsolantPose,
            isPoseCorrecteIsolant: constat.isPoseCorrecteIsolant,
            ecartAutourPointsEclairage: constat.ecartAutourPointsEclairage,
            ecartAutourBoitiersElectrique: constat.ecartAutourBoitiersElectrique,
            ecartAuFeuAutourFumees: constat.ecartAuFeuAutourFumees,
            presenceFilsNonGainesNoyesDansIsolant: constat.presenceFilsNonGainesNoyesDansIsolant,
            conclusionIsolationMurs: constat.conclusionIsolationMurs,
        });
    }

    /**
     * set constat planchers
     */
    setConstatPlanchers(constat: IConstatPlanchers) {
        this.formConstatPlanchers.patchValue({
            surfaceIsolantPrevue: constat.surfaceIsolantPrevue,
            surfaceIsolantPose: constat.surfaceIsolantPose,
            isPoseCorrecteIsolant: constat.isPoseCorrecteIsolant,
            ecartAutourPointsEclairage: constat.ecartAutourPointsEclairage,
            ecartAutourBoitiersElectrique: constat.ecartAutourBoitiersElectrique,
            ecartAuFeuAutourFumees: constat.ecartAuFeuAutourFumees,
            presenceFilsNonGainesNoyesDansIsolant: constat.presenceFilsNonGainesNoyesDansIsolant,
            conclusionIsolationPlanchers: constat.conclusionIsolationPlanchers,
        });
    }
    //#region Methods

    /** dismiss modal controller */
    dismiss() {
        this.modalController.dismiss();
    }

    /** save signature */
    async save() {
        if (this.form.valid && this.formConstatPlanchers.valid && this.formConstatComble.valid && this.formConstatMurs.valid) {
            DialogHelper.openDialog(this.modalController, SignFicheControleComponent, null)
                .then(signatures => {
                    if (!StringHelper.isEmptyOrNull(signatures)) {
                        const ficheControle = this.buildFicheControle(signatures);
                        setTimeout(() => {
                            this.modalController.dismiss(ficheControle);
                        }, 500);
                    }
                });
        } else {
            this.toastService.presentToast({ message: this.translate.instant('ERRORS.FILL_ALL'), type: ToastTypes.Danger });
            this.form.markAllAsTouched();
            this.formConstatPlanchers.markAllAsTouched();
            this.formConstatComble.markAllAsTouched();
            this.formConstatMurs.markAllAsTouched();
        }
    }

    /**
     * build Fiche Controle
     */
    buildFicheControle(signatures: any): IFicheControleModel {
        const ficheControleModel = this.form.value;
        const constatPlanchers: IConstatPlanchers = { ...this.formConstatPlanchers.getRawValue() };
        const constatComble: IConstatCombles = { ...this.formConstatComble.getRawValue() };
        const constatMurs: IConstatMurs = { ...this.formConstatMurs.getRawValue() };

        ficheControleModel.constatCombles = constatComble;
        ficheControleModel.constatMurs = constatMurs;
        ficheControleModel.constatPlanchers = constatPlanchers;

        ficheControleModel.nameClientSignature = signatures.nameClientSignature;
        ficheControleModel.signatureController = signatures.signatureController;
        ficheControleModel.signatureClient = signatures.signatureClient;
        ficheControleModel.photos = this.photos;
        ficheControleModel.evaluationAccompagnement = parseInt(ficheControleModel.evaluationAccompagnement, 10);
        ficheControleModel.evaluationPropreteChantier = parseInt(ficheControleModel.evaluationPropreteChantier, 10);
        ficheControleModel.evaluationTravauxRealises = parseInt(ficheControleModel.evaluationTravauxRealises, 10);
        ficheControleModel.evaluationContactAvecTechniciensApplicateurs =
            parseInt(ficheControleModel.evaluationContactAvecTechniciensApplicateurs, 10);

        return ficheControleModel;
    }

    /**
     * detail pop up signature
     */
    showSignature() {
        const data = {
            title: 'TITLES.SHOW_FICHE_DE_CONTROLE',
            readOnly: true,
            signatureClient: this.signatureClient,
            nameSignatureClient: this.nameClientSignature,
            signatureController: this.signatureController
        };
        DialogHelper.openDialog(this.modalController, SignFicheControleComponent, data);
    }
    //#endregion

}
