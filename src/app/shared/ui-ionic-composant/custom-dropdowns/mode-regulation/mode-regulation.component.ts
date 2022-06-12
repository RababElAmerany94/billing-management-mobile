import { Component, OnInit, Input } from '@angular/core';
import { BaseUiCustomComponent } from '../../base-ui-custom.component';
import { IRegulationMode } from 'src/app/core/models/general/regulation-mode.model';
import { RegulationModeService } from 'src/app/core/services/regulation-mode-service/regulation-mode.service';
import { SortDirection } from 'src/app/core/enums/sort-direction';
import { AppSettings } from 'src/app/app-settings/app-settings';

@Component({
    selector: 'app-mode-regulation',
    template: `
        <ng-container *ngIf="loaded">
            <ion-item [formGroup]="formInstant"  class="{{customInput}}">
            <ion-label>{{label}}</ion-label>
            <ion-select [id]="inputName" [formControlName]="inputName" interface="popover">
                <ion-select-option value="">{{ 'LABELS.ANY' | translate }}</ion-select-option>
                <ion-select-option *ngFor="let item of regulationModes" [value]="item?.id">
                {{item?.name}}
                </ion-select-option>
            </ion-select>
            </ion-item>
            <app-custom-error-display [control]="control"></app-custom-error-display>
        </ng-container>
    `
})
export class ModeRegulationComponent extends BaseUiCustomComponent implements OnInit {

    @Input()
    set exclude(val: string[]) {
        if (val) {
            this.excludeRegulationMode = val;
            this.removeExclude();
        }
    }

    /** the list of regulation modes  */
    regulationModes: IRegulationMode[] = [];

    /** the list ids of exclude regulation mode */
    excludeRegulationMode: string[] = [];

    loaded = false;
    constructor(private regulationModeService: RegulationModeService) {
        super();
    }

    ngOnInit() {
        this.getModeRegulations();
    }

    /**
     * get list mode de regulation
     */
    getModeRegulations() {
        this.regulationModeService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'Classement',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
        }).subscribe(result => {
            this.regulationModes = result.value;
            this.removeExclude();
            this.loaded = true;
        });
    }

    /**
     * remove exclude regulation mode from the list
     */
    removeExclude() {
        this.regulationModes = this.regulationModes
            .filter(e => this.excludeRegulationMode.filter(c => c === e.id).length === 0);
    }
}
