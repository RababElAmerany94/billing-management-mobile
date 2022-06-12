import { Injectable } from '@angular/core';
import { AppSettings } from '../../../app-settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base-service/base.service';
import { IUnite, IUniteModel } from '../../models/unite/unite.model';

@Injectable({
  providedIn: 'root'
})
export class UniteService extends BaseService<IUnite, IUniteModel, IUniteModel, number> {

  static endPoint = AppSettings.API_ENDPOINT + 'Unite/';

  constructor(protected http: HttpClient) {
    super(http, UniteService.endPoint);
  }
}
