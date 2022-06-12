import { Injectable } from '@angular/core';
import { BaseService } from '../base-service/base.service';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { IProduit, IProduitModel } from '../../models/produit/produits.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitService extends BaseService<IProduit, IProduitModel, IProduitModel, number> {

  /**
   * the api end point
   */
  public static endPoint = `${AppSettings.API_ENDPOINT}Produit/`;

  constructor(protected http: HttpClient) {
      super(http, ProduitService.endPoint);
  }
}
