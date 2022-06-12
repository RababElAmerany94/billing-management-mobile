import { Component, OnInit } from '@angular/core';
import { BaseUiCustomComponent } from '../../base-ui-custom.component';
import { IUser } from 'src/app/core/models/user/userModel';
import { UsersService } from 'src/app/core/services/user-service/users.service';
import { SortDirection } from 'src/app/core/enums/sort-direction';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { UserProfile } from 'src/app/core/enums/user-roles.enum';

@Component({
    selector: 'app-dropdown-technicien',
    template: `
    <ng-container *ngIf="loaded">
            <ion-item [formGroup]="formInstant" class="{{customInput}}">
                <ion-label>{{label}}</ion-label>
                <ion-select [id]="inputName" [formControlName]="inputName" interface="popover" >
                    <ion-select-option *ngFor="let item of techniciens" [value]="item?.id">
                        {{item?.firstName }} {{item?.lastName }}
                    </ion-select-option>
                </ion-select>
            </ion-item>
            <app-custom-error-display [control]="control"></app-custom-error-display>
        </ng-container>
    `
})
export class DropdownTechnicienComponent extends BaseUiCustomComponent implements OnInit {

    techniciens: IUser[] = [];

    loaded = false;

    constructor(private usersService: UsersService) {
        super();
    }

    ngOnInit() {
        this.getTechniciens();
    }

    /**
     * get list of technicien
     */
    getTechniciens() {
        this.usersService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'Id',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
            rolesId: [UserProfile.Technicien]
        }).subscribe(result => {
            this.techniciens = result.value;
            this.loaded = true;
        });
    }
}
