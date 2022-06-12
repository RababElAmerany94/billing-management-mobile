import { Component, Input } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ModeEnum } from 'src/app/core/enums/mode.enum';
import { RouteName } from 'src/app/core/enums/route.enum';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { DossierHelper } from 'src/app/core/helpers/dossier';
import { StringHelper } from 'src/app/core/helpers/string';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { IEchangeCommercial } from 'src/app/pages/agenda-commercial/echange-commercial.model';
import { IDossier, IDossierModel } from 'src/app/pages/dossier/dossier.model';
import { DossierService } from 'src/app/pages/dossier/dossier.service';
import { SelectDossiersComponent } from '../../data-selectors/select-dossiers/select-dossiers.component';
import { SaisieLibreDossierComponent } from '../../saisie-libre-dossier/saisie-libre-dossier.component';
import { BaseUiCustomComponent } from '../base-ui-custom.component';

@Component({
    selector: 'app-select-dossier',
    template: `
        <ion-item no-padding class="{{customInput}}" [formGroup]="formInstant">
            <ion-label position="floating">
                <ng-container *ngIf="iconName">
                    <ion-icon
                        [name]="iconName"
                        item-start>
                    </ion-icon>
                </ng-container>
                {{label}}
            </ion-label>
            <ion-input
                [disabled]="formInstant.disabled"
                [value]="selectedDossier ? selectedDossier?.reference+
                            ( selectedDossier?.client ? ':' + selectedDossier?.client?.fullName : '' ) : ''"
                (ionFocus)="chooseDossier()">
            </ion-input>
            <input type="hidden" [id]="inputName" [name]="inputName" [formControlName]="inputName" >
            <ion-icon
                class="suffix-icon"
                color="primary"
                name="eye-outline"
                slot="end"
                (click)="showEvent()">
            </ion-icon>
            <ion-button
                *ngIf="showAdd"
                color="light"
                class="suffix-icon no-ripple no-shadow"
                slot="end"
                (click)="addDossierDialog()">
                <ion-icon
                    color="primary"
                    name="add-outline"
                    slot="icon-only">
                </ion-icon>
            </ion-button>
        </ion-item>
        <app-custom-error-display [control]="control"></app-custom-error-display>
    `
})
export class SelectDossierComponent extends BaseUiCustomComponent {

    @Input()
    showAdd = false;

    @Input()
    echangeCommercial: IEchangeCommercial;

    @Input()
    set dossier(value: IDossier) {
        this.selectedDossier = value;
        this.setDossierInForm();
    }

    selectedDossier: IDossier;

    constructor(
        private modalController: ModalController,
        private router: Router,
        private translate: TranslateService,
        private loadingService: LoadingService,
        private dossierService: DossierService,
        private toastService: ToastService
    ) {
        super();
    }

    chooseDossier() {
        DialogHelper.openDialog(this.modalController, SelectDossiersComponent, null)
            .then(result => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    this.selectedDossier = result;
                    this.changeEvent.emit(this.selectedDossier);
                    this.setDossierInForm();
                }
            });
    }

    showEvent() {
        if (this.selectedDossier) {
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    mode: ModeEnum.Show,
                    id: this.selectedDossier != null ? this.selectedDossier.id : null,
                    isNavigationRoute: true
                }
            };
            this.router.navigate([`/${RouteName.Dossier}`], navigationExtras);
        }
    }

    addDossierDialog() {
        const data = {
            echangeCommercial: this.echangeCommercial != null ? this.echangeCommercial : null,
        };
        DialogHelper.openDialog(this.modalController, SaisieLibreDossierComponent, data)
            .then(result => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    this.addDossier(result);
                }
            });
    }

    async addDossier(dossierModel: IDossierModel) {
        await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
        DossierHelper.CheckReferenceIsUnique(this.dossierService, this.toastService, dossierModel, this.translate, null, true,
            async (checkResult: boolean) => {
                if (checkResult) {
                    this.dossierService.Add(dossierModel).subscribe(async result => {
                        await this.loadingService.hide();
                        this.selectedDossier = result.value;
                        this.changeEvent.emit(this.selectedDossier);
                        this.setDossierInForm();
                    }, async _ => await this.loadingService.hide());
                } else {
                    await this.loadingService.hide();
                }
            });
    }

    private setDossierInForm() {
        if (this.selectedDossier != null) {
            this.formInstant.get(this.inputName).setValue(this.selectedDossier.id);
        }
    }
}
