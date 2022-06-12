import { OnInit, Component } from '@angular/core';
import { AppSettings } from '../../../../app-settings/app-settings';
import { SortDirection } from '../../../../core/enums/sort-direction';
import { BaseUiCustomComponent } from '../../base-ui-custom.component';
import { IUnite } from '../../../../core/models/unite/unite.model';
import { UniteService } from '../../../../core/services/unite/unite.service';

@Component({
    selector: 'app-dropdown-unite',
    template: `
    <ng-container *ngIf="loaded" >
        <ion-item [formGroup]="formInstant"  class="{{customInput}}">
            <ion-label>{{ label }}</ion-label>
            <ion-select [id]="inputName" [formControlName]="inputName" interface="popover">
                <ion-select-option *ngFor="let item of unites" [value]="item?.name">
                    {{ item?.name }}
                </ion-select-option>
            </ion-select>
        </ion-item>
        <app-custom-error-display [control]="control"></app-custom-error-display>
    </ng-container>
  `
})
export class DropdownUniteComponent extends BaseUiCustomComponent implements OnInit {

    /** list of unites */
    unites: IUnite[] = [];

    /** is data loaded */
    loaded = false;

    constructor(
        private uniteService: UniteService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.getUnites();
    }

    /**
     * get list unites
     */
    getUnites() {
        this.uniteService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'id',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
        }).subscribe(result => {
            this.unites = result.value;
            this.loaded = true;
        });
    }

}
