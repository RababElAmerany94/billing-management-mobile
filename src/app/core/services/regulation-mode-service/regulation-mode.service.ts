import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { IFilterOption } from '../../models/general/filter-option.model';
import { IPagedResult } from '../../models/general/result-model';
import { IRegulationMode } from '../../models/general/regulation-mode.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegulationModeService {
  static endPoint = `${AppSettings.API_ENDPOINT}RegulationModes/`;

  constructor(protected http: HttpClient) {
  }
  /**
   * get bank account
   * @param filterOption the filter option
   */
  GetAsPagedResult(filterOption: IFilterOption): Observable<IPagedResult<IRegulationMode>> {
    return this.http.post<IPagedResult<IRegulationMode>>(`${RegulationModeService.endPoint}`, filterOption, AppSettings.RequestOptions());
  }
}
