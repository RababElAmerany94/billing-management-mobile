import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { IFilterOption } from '../../models/general/filter-option.model';
import { Observable } from 'rxjs';
import { IPagedResult } from '../../models/general/result-model';
import { Country } from '../../models/general/country.model';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  static endPoint = `${AppSettings.API_ENDPOINT}Address/`;

  constructor(private http: HttpClient) { }

  /**
   * get all countries
   * @param filterOption the filter option
   */
  GetAsPagedResult(filterOption: IFilterOption): Observable<IPagedResult<Country>> {
    return this.http.post<IPagedResult<Country>>(`${CountryService.endPoint}Countries`, filterOption, AppSettings.RequestOptions());
  }

  /**
   * get country by id
   * @param id the id of the country
   */
  Get(id: string): Observable<Country> {
    return this.http.get<Country>(`${CountryService.endPoint}Country/${id}`);
  }
}
