import { Component, OnInit } from '@angular/core';
import { BaseUiCustomComponent } from '../../base-ui-custom.component';
import { SortDirection } from 'src/app/core/enums/sort-direction';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { IBankAccount } from 'src/app/core/models/general/bank-account.model';
import { BankAccountService } from 'src/app/core/services/bankAccount-service/bank-account.service';

@Component({
  selector: 'app-bank-account-dropdown',
  template: `
    <ng-container *ngIf="loaded">
      <ion-item [formGroup]="formInstant"  class="{{customInput}}">
        <ion-label>{{label}}</ion-label>
        <ion-select [id]="inputName" interface="popover" [formControlName]="inputName">
          <ion-select-option *ngFor="let item of bankAccounts" [value]="item?.id">
                    {{ item?.name }}
          </ion-select-option>
        </ion-select>
      </ion-item>
      <app-custom-error-display [control]="control"></app-custom-error-display>
    </ng-container>
  `
})
export class BankAccountDropdownComponent extends BaseUiCustomComponent implements OnInit {


  /** the list mode regulation mode */
  bankAccounts: IBankAccount[] = [];

  /** is data loaded */
  loaded = false;

  constructor(
    private bankAccountService: BankAccountService) {
    super();
  }

  ngOnInit() {
    this.getBankAccount();
  }

  /**
   * get list bank accounts
   */
  getBankAccount() {
    this.bankAccountService.GetAsPagedResult({
      SearchQuery: '',
      OrderBy: 'name',
      SortDirection: SortDirection.Asc,
      Page: 1,
      PageSize: AppSettings.MAX_GET_DATA,
    }).subscribe(result => {
      this.bankAccounts = result.value;
      this.loaded = true;
    });
  }

}
