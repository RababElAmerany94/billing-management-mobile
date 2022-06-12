import { Component, OnInit } from '@angular/core';
import { ITypeChauffage } from 'src/app/core/models/type-chauffage/type-chauffage.model';
import { TypeChauffageService } from 'src/app/core/services/type-chauffage.service';
import { AppSettings } from '../../../../app-settings/app-settings';
import { SortDirection } from '../../../../core/enums/sort-direction';
import { BaseUiCustomComponent } from '../../base-ui-custom.component';

@Component({
    selector: 'app-type-chauffage-dropdown',
    template: `
        <ng-container *ngIf="loaded">
            <ion-item [formGroup]="formInstant" class="{{customInput}}">
                <ion-label>{{label}}</ion-label>
                <ion-select [id]="inputName" [formControlName]="inputName" interface="popover" >
                    <ion-select-option value="">{{ 'LABELS.ANY' | translate }}</ion-select-option>
                    <ion-select-option *ngFor="let item of typeChauffage" [value]="item?.id">
                        {{item?.name }}
                    </ion-select-option>
                </ion-select>
            </ion-item>
            <app-custom-error-display [control]="control"></app-custom-error-display>
        </ng-container>
    `
})
export class TypeChauffageDropdownComponent extends BaseUiCustomComponent implements OnInit {

    /**
     * the list of type de logement
     */
    typeChauffage: ITypeChauffage[] = [];
    loaded = false;

    constructor(
        private typeChauffageService: TypeChauffageService
    ) {
        super();
    }

    ngOnInit(): void {
        this.getTypeChauffage();
    }

    /**
     * get list typeChauffage
     */
    getTypeChauffage() {
        this.typeChauffageService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'raisonSociale',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
        }).subscribe(result => {
            this.typeChauffage = result.value;
            this.loaded = true;
        });
    }

    /**
     * change select
     */
    changeSelect(fournisseurId: string) {
        if (fournisseurId != null) {
            this.changeEvent.emit(this.typeChauffage.find(e => e.id === fournisseurId));
        } else {
            this.changeEvent.emit(null);
        }
    }
}
