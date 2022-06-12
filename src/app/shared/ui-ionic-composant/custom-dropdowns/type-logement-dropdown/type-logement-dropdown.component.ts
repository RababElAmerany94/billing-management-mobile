import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../../app-settings/app-settings';
import { SortDirection } from '../../../../core/enums/sort-direction';
import { ITypeLogement } from '../../../../core/models/type-logement/fournisseurs.model';
import { TypeLogementService } from '../../../../core/services/type-logement.service';
import { BaseUiCustomComponent } from '../../base-ui-custom.component';

@Component({
    selector: 'app-type-logement-dropdown',
    template: `
        <ng-container *ngIf="loaded">
            <ion-item [formGroup]="formInstant" class="{{customInput}}">
                <ion-label>{{label}}</ion-label>
                <ion-select [id]="inputName" [formControlName]="inputName" interface="popover" >
                    <ion-select-option value="">{{ 'LABELS.ANY' | translate }}</ion-select-option>
                    <ion-select-option *ngFor="let item of typeLogement" [value]="item?.id">
                        {{item?.name }}
                    </ion-select-option>
                </ion-select>
            </ion-item>
            <app-custom-error-display [control]="control"></app-custom-error-display>
        </ng-container>
    `
})
export class TypeLogementDropdownComponent extends BaseUiCustomComponent implements OnInit {

    /**
     * the list of type de logement
     */
    typeLogement: ITypeLogement[] = [];
    loaded = false;

    constructor(
        private typeLogementService: TypeLogementService
    ) {
        super();
    }

    ngOnInit(): void {
        this.getTypeLogement();
    }

    /**
     * get list typeLogement
     */
    getTypeLogement() {
        this.typeLogementService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'raisonSociale',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
        }).subscribe(result => {
            this.typeLogement = result.value;
            this.loaded = true;
        });
    }
    /**
     * change select
     */
    changeSelect(fournisseurId: string) {
        if (fournisseurId != null) {
            this.changeEvent.emit(this.typeLogement.find(e => e.id === fournisseurId));
        } else {
            this.changeEvent.emit(null);
        }
    }
}
