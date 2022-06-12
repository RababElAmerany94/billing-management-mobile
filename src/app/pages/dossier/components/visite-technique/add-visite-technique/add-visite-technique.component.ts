import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { VisteTechniqueToit } from 'src/app/core/enums/viste-technique-toit.enum';
import { VisteTechniqueTypeAccess } from 'src/app/core/enums/viste-technique-type-access.enum';
import { VisteTechniqueType } from 'src/app/core/enums/viste-technique-type.enum';
import { ConversionHelper } from 'src/app/core/helpers/conversion';
import { IDropDownItem } from 'src/app/core/models/general/drop-down-item.model';
import { IVisteTechniqueFormulaire } from '../../../dossier.model';

@Component({
    selector: 'app-add-visite-technique',
    templateUrl: './add-visite-technique.component.html',
    styleUrls: [
        '../../../../../../assets/components/input.scss',
        '../../../../../../assets/components/grid.scss'
    ],
})
export class AddVisiteTechniqueComponent implements OnInit {

    form: FormGroup;

    /** dropdowns */
    visteTechniqueTypeAccess: IDropDownItem<number, string>[] = [];
    visteTechniqueToit: IDropDownItem<number, string>[] = [];

    typeVisiteTechnique: VisteTechniqueType;
    typeVisiteTechniques = VisteTechniqueType;
    formulaire: IVisteTechniqueFormulaire;

    isToit = false;
    isTrappe = false;
    isShowMode = false;

    title: string;

    constructor(
        private modalController: ModalController,
        private navParams: NavParams,
        private fb: FormBuilder,
    ) {
        this.typeVisiteTechnique = this.navParams.get('isPrimeCEE');
        this.formulaire = this.navParams.get('formulaire');
        this.isShowMode = this.navParams.get('isShowMode');
        this.title = this.navParams.get('title');
        this.initForm();
        this.chargeVisteTechniqueTypeAccess();
        this.chargeVisteTechniqueToit();
    }

    //#region forms

    /**
     * initialize form
     */
    initForm() {
        this.form = this.fb.group({
            typeAccess: [null],
            dimensions: [null],
            toit: [null],
            detailTypeAccess: [null],
            surfaceComble: [null],
            surfacePiece: [null],
            typePlancher: [null],
            hauteurSousFaitage: [null],
            hauteurSousPlafond: [null],
            nombreConduitCheminee: [null],
            nombreSpotsAProteger: [null],
            nombreLuminaire: [null],
            nombreVMC: [null],
            presenceTuyauterie: [null],
            typeSupport: [null],
            presencePorteGarge: [null],
            isDegagementAPrevoir: [false],
            isACoffrer: [false],
            isARehausser: [false],
            isPresenceNuisibles: [false],
            typeNuisible: [null],
            isPresenceBoitesDerivation: [false],
        });
    }

    /**
     * setData form
     */
    setData(visiteTechnique: IVisteTechniqueFormulaire) {
        this.form.setValue({
            typeAccess: visiteTechnique.typeAccess,
            dimensions: visiteTechnique.dimensions,
            toit: visiteTechnique.toit,
            detailTypeAccess: visiteTechnique.detailTypeAccess,
            surfaceComble: visiteTechnique.surfaceComble,
            surfacePiece: visiteTechnique.surfacePiece,
            typePlancher: visiteTechnique.typePlancher,
            hauteurSousFaitage: visiteTechnique.hauteurSousFaitage,
            hauteurSousPlafond: visiteTechnique.hauteurSousPlafond,
            nombreConduitCheminee: visiteTechnique.nombreConduitCheminee,
            nombreSpotsAProteger: visiteTechnique.nombreSpotsAProteger,
            nombreLuminaire: visiteTechnique.nombreLuminaire,
            nombreVMC: visiteTechnique.nombreVMC,
            presenceTuyauterie: visiteTechnique.presenceTuyauterie,
            typeSupport: visiteTechnique.typeSupport,
            presencePorteGarge: visiteTechnique.presencePorteGarge,
            isDegagementAPrevoir: visiteTechnique.isDegagementAPrevoir,
            isACoffrer: visiteTechnique.isACoffrer,
            isARehausser: visiteTechnique.isARehausser,
            isPresenceNuisibles: visiteTechnique.isPresenceNuisibles,
            typeNuisible: visiteTechnique.typeNuisible,
            isPresenceBoitesDerivation: visiteTechnique.isPresenceBoitesDerivation,
        });
    }

    ngOnInit(): void {
        if (this.formulaire) {
            this.setData(this.formulaire);
        }
        if (this.isShowMode) {
            this.form.disable();
        }
    }
    //#endregion

    //#region helpers

    /** viste Technique Type Access Technique enum  */
    chargeVisteTechniqueTypeAccess() {
        this.visteTechniqueTypeAccess = ConversionHelper.convertEnumToListKeysValues(VisteTechniqueTypeAccess, 'number');
        this.visteTechniqueTypeAccess.forEach(e => e.text = `VISITE_TECHNIQUE_TYPE_ACCESS.${e.value}`);
    }

    /** viste Technique Toit enum  */
    chargeVisteTechniqueToit() {
        this.visteTechniqueToit = ConversionHelper.convertEnumToListKeysValues(VisteTechniqueToit, 'number');
        this.visteTechniqueToit.forEach(e => e.text = `VISITE_TECHNIQUE_TOIT.${e.value}`);
    }

    visteTechniqueTypeAccessEvent(item: VisteTechniqueTypeAccess) {
        if (item === VisteTechniqueTypeAccess.Trappe) {
            this.isTrappe = true;
            this.isToit = false;
        } else if (item === VisteTechniqueTypeAccess.Toit) {
            this.isTrappe = false;
            this.isToit = true;
        } else if (item === VisteTechniqueTypeAccess.Autre) {
            this.isTrappe = false;
            this.isToit = false;
        }
    }

    //#endregion

    //#region Save

    save() {
        this.modalController.dismiss({ ...this.form.value });
    }

    /** dismiss modal controller */
    dismiss() {
        this.modalController.dismiss();
    }

    //#endregion

}
