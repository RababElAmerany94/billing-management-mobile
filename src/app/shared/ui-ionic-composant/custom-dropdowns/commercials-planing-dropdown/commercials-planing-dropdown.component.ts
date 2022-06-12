import { Component, Input } from '@angular/core';
import { UsersService } from 'src/app/core/services/user-service/users.service';
import { BaseUiCustomComponent } from '../../base-ui-custom.component';
import { SortDirection } from 'src/app/core/enums/sort-direction';
import { ResultStatus } from 'src/app/core/enums/result-status';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { ICommercialPlanning } from 'src/app/core/models/general/commercial-planning.model';

@Component({
  selector: 'app-commercials-planning-dropdown',
  template: `
  <ng-container *ngIf="loaded">
    <ion-item [formGroup]="formInstant" class="{{customInput}}">
      <ion-label>{{label}}</ion-label>
      <ion-select
          [id]="inputName"
          cancelText="Annuler"
          okText="Enregister"
          [formControlName]="inputName"
          (ionChange)="changeSelect($event.detail.value)">
          <ion-select-option *ngFor="let item of commercialsPlanning" [value]="item?.id" >
                  {{item?.fullName }}
          </ion-select-option>
      </ion-select>
    </ion-item>
    <app-custom-error-display [control]="control"></app-custom-error-display>
  </ng-container>
  `
})
export class CommercialsPlanningDropdownComponent extends BaseUiCustomComponent {

  /** set date rdv */
  @Input()
  set dateRDV(value: Date) {
    if (value != null) {
      this.getCommercialsPlanning(value);
    }
  }
  /** list commercial */
  commercialsPlanning: ICommercialPlanning[];
  /** is data loaded */
  loaded = false;

  constructor(
    private userService: UsersService
  ) { super(); }


  /** commercial planing filters */
  getCommercialsPlanning(dateRDV: Date) {
    this.userService.GetCommercialsPlanning({
      SearchQuery: '',
      OrderBy: 'id',
      SortDirection: SortDirection.Asc,
      Page: 1,
      PageSize: AppSettings.MAX_GET_DATA,
      dateRDV
    }).subscribe(result => {
      if (result.status === ResultStatus.Succeed) {
        this.commercialsPlanning = result.value;
        this.changeSelect(this.formInstant.get(this.inputName).value);
        this.loaded = true;
      }
    });
  }

  /**
   * change select
   */
  changeSelect(technicienId) {
    if (technicienId != null) {
      this.changeEvent.emit(this.commercialsPlanning.find(e => e.id === technicienId));
    } else {
      this.changeEvent.emit(null);
    }
  }

}
