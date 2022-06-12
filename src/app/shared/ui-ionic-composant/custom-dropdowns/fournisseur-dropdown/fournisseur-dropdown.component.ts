import { Component, OnInit } from '@angular/core';
import { IFournisseur } from '../../../../core/models/fournisseur/fournisseurs.model';
import { BaseUiCustomComponent } from '../../base-ui-custom.component';
import { SortDirection } from '../../../../core/enums/sort-direction';
import { AppSettings } from '../../../../app-settings/app-settings';
import { SuppliersService } from '../../../../core/services/suppliers.service';

@Component({
    selector: 'app-fournisseur-dropdown',
    template: `
        <ng-container *ngIf="loaded">
            <ion-item [formGroup]="formInstant" class="{{customInput}}">
                <ion-label>{{label}}</ion-label>
                <ion-select [id]="inputName" [formControlName]="inputName" interface="popover" >
                <ion-select-option
                    *ngFor="let item of fournisseurs"
                    [value]="item?.id">
                        {{item?.raisonSociale }}
                </ion-select-option>
                </ion-select>
            </ion-item>
            <app-custom-error-display [control]="control"></app-custom-error-display>
        </ng-container>
    `
})
export class FournisseurDropdownComponent extends BaseUiCustomComponent implements OnInit {

    /**
     * the list of fournisseurs
     */
    fournisseurs: IFournisseur[] = [];
    loaded = false;

    constructor(
        private fournisseurService: SuppliersService
    ) {
        super();
    }

    ngOnInit(): void {
        this.getFournisseurs();
    }

    /**
     * get list fournisseurs
     */
    getFournisseurs() {
        this.fournisseurService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'raisonSociale',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
        }).subscribe(result => {
            this.fournisseurs = result.value;
            this.loaded = true;
        });
    }
    /**
     * change select
     */
    changeSelect(fournisseurId: string) {
        if (fournisseurId != null) {
            this.changeEvent.emit(this.fournisseurs.find(e => e.id === fournisseurId));
        } else {
            this.changeEvent.emit(null);
        }
    }
}
