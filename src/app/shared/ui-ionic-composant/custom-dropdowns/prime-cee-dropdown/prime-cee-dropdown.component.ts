import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { ClientType } from 'src/app/core/enums/client-type.enum';
import { SortDirection } from 'src/app/core/enums/sort-direction';
import { IClient } from 'src/app/pages/clients/client.model';
import { ClientsService } from 'src/app/pages/clients/client.service';
import { BaseUiCustomComponent } from '../../base-ui-custom.component';

@Component({
    selector: 'app-prime-cee-dropdown',
    template: `
        <ng-container *ngIf="loaded">
            <ion-item [formGroup]="formInstant"  class="{{customInput}}">
            <ion-label>{{label}}</ion-label>
            <ion-select [id]="inputName" interface="popover" [formControlName]="inputName">
                <ion-select-option value="">{{ 'LABELS.ANY' | translate }}</ion-select-option>
                <ion-select-option *ngFor="let item of clients" [value]="item.id">
                    {{item?.fullName }}
                </ion-select-option>
            </ion-select>
            </ion-item>
            <app-custom-error-display [control]="control"></app-custom-error-display>
        </ng-container>
    `
})
export class PrimeCeeDropdownComponent extends BaseUiCustomComponent implements OnInit {

    /** list of client obliges */
    clients: IClient[] = [];

    /** is data loaded */
    loaded = false;

    constructor(
        private clientsService: ClientsService
    ) { super(); }

    ngOnInit() {
        this.getClientObligees();
    }

    /**
     * get list clients obliges
     */
    getClientObligees() {
        this.clientsService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'id',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
            type: ClientType.Obliges
        }).subscribe(result => {
            this.clients = result.value;
            this.loaded = true;
        });
    }

}
