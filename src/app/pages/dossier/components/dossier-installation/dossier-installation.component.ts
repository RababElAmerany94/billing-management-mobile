import { Component, Input } from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/base-features/base-edit.component';
import { IDossierInstallation, IDossierInstallationModel } from './dossier-installation.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DateHelper } from 'src/app/core/helpers/date';

@Component({
  selector: 'app-dossier-installation',
  templateUrl: './dossier-installation.component.html',
})
export class DossierInstallationComponent extends BaseEditComponent<IDossierInstallationModel> {

  form: FormGroup;

  @Input()
  set DossierInstallation(dossier: IDossierInstallation[]) {
    this.initFormDateInstalation();
    if (dossier && dossier.length > 0) {
      this.setDataInForm(dossier[0]);
    }
    this.form.disable();
  }

  constructor(
    private fb: FormBuilder,
  ) {
    super();
  }

  /**
   * initialize form date installation
   */
  initFormDateInstalation() {
    this.form = this.fb.group({
      technicienId: [null],
      dateInstallation: [null],
      status: [null]
    });
  }

  /**
   * setData form
   */
  setDataInForm(dossier: IDossierInstallation) {
    this.form.setValue({
      status: '',
      technicienId: dossier.technicien ? dossier.technicien.fullName : '',
      dateInstallation: dossier.dateInstallation ? DateHelper.getDates(dossier.dateInstallation) : '',
    });
  }
}
