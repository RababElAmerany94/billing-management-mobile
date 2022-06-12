import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertController, ModalController, NavController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { VisteTechniqueType } from 'src/app/core/enums/viste-technique-type.enum';
import { ObjectHelper } from 'src/app/core/helpers/object';
import { IDropDownItem } from 'src/app/core/models/general/drop-down-item.model';
import { ToastService, ToastTypes } from 'src/app/core/services/toast.service';
import { BaseDocumentsComponent } from 'src/app/shared/base-features/base-documents.component';
import { FormBuilder, Validators } from '@angular/forms';
import { ConversionHelper } from 'src/app/core/helpers/conversion';
import { ClassementTechnique } from 'src/app/core/enums/classement-technique.enum';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { StringHelper } from 'src/app/core/helpers/string';
import { AddTypeVisiteTechniqueComponent } from '../add-type-visite-technique/add-type-visite-technique.component';
import { AddVisiteTechniqueComponent } from './add-visite-technique/add-visite-technique.component';
import { IVisteTechnique, IVisteTechniqueFormulaire } from '../../dossier.model';

@Component({
  selector: 'app-visite-technique',
  templateUrl: './visite-technique.component.html',
  styleUrls: [
    '../../../../../assets/components/input.scss',
    '../../../../../assets/components/dashboard.scss',
    '../../../../../assets/components/grid.scss'
  ],
})
export class VisiteTechniqueComponent extends BaseDocumentsComponent<IVisteTechnique> {

  /** dropdowns */
  classementTechnique: IDropDownItem<number, string>[] = [];

  /** form of visite technique */
  formulaires: IVisteTechniqueFormulaire[] = [];

  visiteTechnique: IVisteTechnique;
  typeVisiteTechnique: VisteTechniqueType;
  typeVisiteTechniques = VisteTechniqueType;
  istypeChooseen = false;
  isShowModeVisiteTechnique = false;

  /** set the visite Technique dossier */
  @Input()
  set VisiteTechnique(visiteTechnique: IVisteTechnique) {
    if (!ObjectHelper.isNullOrUndefined(visiteTechnique)) {
      this.visiteTechnique = visiteTechnique;
      this.formulaires = visiteTechnique.formulaires;
      this.typeVisiteTechnique = visiteTechnique.type;
      this.istypeChooseen = true;
      this.isShowModeVisiteTechnique = true;
      this.setData(visiteTechnique);
    }
  }

  constructor(
    private translate: TranslateService,
    private toastService: ToastService,
    public modalController: ModalController,
    private alertController: AlertController,
    public popoverCtrl: PopoverController,
    public navCtrl: NavController,
    public router: Router,
    private fb: FormBuilder,
    public location: Location,
  ) {
    super(modalController, navCtrl, router, location);
    this.initFormVisiteTechnique();
    this.initFormVisiteTechnique();
    this.chargeClassementTechnique();
  }

  //#region forms

  /**
   * initialize form
   */
  initFormVisiteTechnique() {
    this.form = this.fb.group({
      nombrePiece: [0, [Validators.required]],
      surfaceTotaleAIsoler: [null, [Validators.required]],
      classementTechnique: [null, [Validators.required]],
    });
  }

  //#endregion

  //#region click event

  /**
   * save a form to visite technique
   */
  save() {
    if (this.form.valid) {
      const visiteTechnique: IVisteTechnique = { ...this.form.value };
      visiteTechnique.formulaires = this.formulaires;
      visiteTechnique.type = this.typeVisiteTechnique;
      this.addEvent.emit(visiteTechnique);
    } else {
      this.toastService.presentToast({ message: this.translate.instant('ERRORS.FILL_ALL'), type: ToastTypes.Danger });
      this.form.markAllAsTouched();
    }
  }

  /**
   * add visite technique associate with dossier
   */
  addClick() {
    const data = { title: 'RELATION_CLIENT.ADD_RELATION_CLIENT', showIsDefault: true };
    DialogHelper.openDialog(this.modalController, AddTypeVisiteTechniqueComponent, data).then(result => {
      if (!StringHelper.isEmptyOrNull(result)) {
        this.typeVisiteTechnique = result;
        this.istypeChooseen = true;
      }
    });
  }

  /**
   * add a form to visite technique
   */
  addForm() {
    const data = {
      typeVisiteTechnique: this.typeVisiteTechnique,
      title: 'FORMULAIRE.ADD_TITLE'
    };
    DialogHelper.openDialog(this.modalController, AddVisiteTechniqueComponent, data).then(result => {
      if (!StringHelper.isEmptyOrNull(result)) {
        this.formulaires.push(result);
        this.form.get('nombrePiece').setValue(this.form.value.nombrePiece + 1);
      }
    });
  }

  /**
   * show form
   */
  openForm(index: number) {
    const data = {
      typeVisiteTechnique: this.typeVisiteTechnique,
      isShowMode: true,
      formulaire: this.formulaires[index],
      title: 'FORMULAIRE.SHOW_TITLE'
    };
    DialogHelper.openDialog(this.modalController, AddVisiteTechniqueComponent, data);
  }

  /**
   * edit a form to visite technique
   */
  editForm(index: number) {
    const data = {
      typeVisiteTechnique: this.typeVisiteTechnique,
      formulaire: this.formulaires[index],
      title: 'FORMULAIRE.EDIT_TITLE'
    };
    DialogHelper.openDialog(this.modalController, AddVisiteTechniqueComponent, data).then(result => {
      if (!StringHelper.isEmptyOrNull(result)) {
        this.formulaires[index] = result;
      }
    });
  }

  /**
   * remove form to visite technique
   */
  removeForm(index: number) {
    DialogHelper.presentAlert(
      this.alertController,
      this.translate,
      {
        headerText: this.translate.instant('FORMULAIRE.DELETE.HEADER'),
        message: this.translate.instant('FORMULAIRE.DELETE.MESSAGE'),
        done: async () => {
          this.formulaires.splice(index, 1);
          this.form.get('nombrePiece').setValue(this.form.value.nombrePiece - 1);
        },
        cancel: () => null
      }
    );
  }

  //#endregion

  //#region helpers

  /** Classement Technique enum  */
  chargeClassementTechnique() {
    this.classementTechnique = ConversionHelper.convertEnumToListKeysValues(ClassementTechnique, 'number');
    this.classementTechnique.forEach(e => e.text = `CLASSEMENT_TECHNIQUE.${e.value}`);
  }

  /**
   * setData form
   */
  setData(visiteTechnique: IVisteTechnique) {
    this.form.setValue({
      nombrePiece: visiteTechnique.nombrePiece,
      surfaceTotaleAIsoler: visiteTechnique.surfaceTotaleAIsoler,
      classementTechnique: visiteTechnique.classementTechnique,
    });
  }

  //#endregion

}
