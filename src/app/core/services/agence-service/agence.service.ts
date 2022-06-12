import { Injectable } from '@angular/core';
import { IAgence } from '../../models/agence/agence.model';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { IFilterOption } from '../../models/general/filter-option.model';
import { IPagedResult } from '../../models/general/result-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgenceService {
  /**
   * the api end point
   */
  public static endPoint = `${ AppSettings.API_ENDPOINT }Agence/`;

  constructor(protected http: HttpClient) {
  }

  /**
   * get all agence as pages result
   * @param filterOption the filter option
   */
  GetAsPagedResult(filterOption: IFilterOption): Observable<IPagedResult<IAgence>> {
    return this.http.post<IPagedResult<IAgence>>(`${ AgenceService.endPoint }`,
      filterOption, AppSettings.RequestOptions());
  }
}