import { Component, OnInit } from '@angular/core';
import { BaseUiCustomComponent } from '../../base-ui-custom.component';
import { Country } from 'src/app/core/models/general/country.model';
import { CountryService } from 'src/app/core/services/countries-service/countries.service';
import { SortDirection } from 'src/app/core/enums/sort-direction';
import { AppSettings } from 'src/app/app-settings/app-settings';

@Component({
  selector: 'app-countries-dropdown',
  template: `
    <ng-container *ngIf="loaded">
      <ion-item [formGroup]="formInstant"  class="{{customInput}}">
        <ion-label>{{label}}</ion-label>
        <ion-select [id]="inputName" interface="popover" [formControlName]="inputName">
          <ion-select-option *ngFor="let item of countries" [value]="item.nomFrFr">
          {{ item.nomFrFr}}
          </ion-select-option>
        </ion-select>
      </ion-item>
      <app-custom-error-display [control]="control"></app-custom-error-display>
    <ng-container>
  `
})
export class CountriesDropdownComponent extends BaseUiCustomComponent implements OnInit {

  countries: Country[] = [];
  loaded = false;
  constructor(
    private countryService: CountryService
  ) { super(); }

  ngOnInit() {
    this.getCountries();
  }

  async getCountries() {
    this.countryService.GetAsPagedResult({
      SearchQuery: '',
      OrderBy: 'nomFrFr',
      SortDirection: SortDirection.Asc,
      Page: 1,
      PageSize: AppSettings.MAX_GET_DATA,
    }).subscribe(result => {
      this.countries = result.value;
      this.loaded = true;
    });
  }
}
