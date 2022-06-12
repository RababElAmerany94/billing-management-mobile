import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { IDepartmentFilterOption } from '../../models/general/filter-option.model';
import { Observable } from 'rxjs';
import { IPagedResult } from '../../models/general/result-model';
import { Departement } from '../../models/general/departement.model';

@Injectable({
  providedIn: 'root'
})
export class DepartementService {
  static endPoint = `${AppSettings.API_ENDPOINT}Address/`;

  constructor(private http: HttpClient) { }

  /**
   *  Get departments with pagination
   * @param filterOption the filter options
   */
  GetAsPagedResult(filterOption: IDepartmentFilterOption): Observable<IPagedResult<Departement>> {
    return this.http.post<IPagedResult<Departement>>(`${DepartementService.endPoint}Departements`,
      filterOption, AppSettings.RequestOptions());
  }

  /**
   * Get departement by id
   * @param id id of departement
   */
  Get(id: string): Observable<Departement> {
    return this.http.get<Departement>(`${DepartementService.endPoint}Departement/${id}`);
  }
}
