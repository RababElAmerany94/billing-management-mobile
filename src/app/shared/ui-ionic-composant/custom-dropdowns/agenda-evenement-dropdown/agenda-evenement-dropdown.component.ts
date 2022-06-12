import { Component, Input, OnInit } from '@angular/core';
import { AppSettings } from '../../../../app-settings/app-settings';
import { SortDirection } from '../../../../core/enums/sort-direction';
import { BaseUiCustomComponent } from '../../base-ui-custom.component';
import { AgendaEvenementService } from '../../../../core/services/agenda.evenement.service';
import { IAgendaConfig } from '../../../../pages/agenda-commercial/echange-commercial.model';
import { AgendaEvenementType } from 'src/app/core/enums/agenda-evenement-type.enum';

@Component({
    selector: 'app-agenda-evenement-dropdown',
    template: `
        <ng-container *ngIf="loaded">
            <ion-item [formGroup]="formInstant" class="{{customInput}}">
                <ion-label>{{label}}</ion-label>
                <ion-select [id]="inputName" [formControlName]="inputName" interface="popover" >
                    <ion-select-option *ngFor="let item of items" [value]="item?.id">
                        {{item?.name }}
                    </ion-select-option>
                </ion-select>
            </ion-item>
            <app-custom-error-display [control]="control"></app-custom-error-display>
        </ng-container>
    `
})
export class AgendaEvenementDropdownComponent extends BaseUiCustomComponent implements OnInit {

    @Input()
    types: AgendaEvenementType;

    items: IAgendaConfig[] = [];
    loaded = false;

    constructor(
        private agendaEvenementService: AgendaEvenementService
    ) {
        super();
    }

    ngOnInit(): void {
        this.getAgendaEvenement();
    }

    /**
     * get list types agenda d'évènement
     */
    getAgendaEvenement() {
        this.agendaEvenementService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'id',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
            type: this.types
        }).subscribe(result => {
            this.items = result.value;
            this.loaded = true;
        });
    }
}
