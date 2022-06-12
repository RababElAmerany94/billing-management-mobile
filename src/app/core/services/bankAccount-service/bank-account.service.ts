import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { IFilterOption } from '../../models/general/filter-option.model';
import { Observable } from 'rxjs';
import { IPagedResult } from '../../models/general/result-model';
import { IBankAccount } from '../../models/general/bank-account.model';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {

  static endPoint = `${AppSettings.API_ENDPOINT}BankAccounts/`;

  constructor(protected http: HttpClient) {
  }
  /**
   * get bank account
   * @param filterOption the filter option
   */
  GetAsPagedResult(filterOption: IFilterOption): Observable<IPagedResult<IBankAccount>> {
    return this.http.post<IPagedResult<IBankAccount>>(`${BankAccountService.endPoint}`, filterOption, AppSettings.RequestOptions());
  }

}
