import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { BaseService } from './base-service/base.service';
import { IFournisseur, IFournisseurModel } from '../models/fournisseur/fournisseurs.model';

@Injectable({
    providedIn: 'root'
})
export class SuppliersService extends BaseService<IFournisseur, IFournisseurModel, IFournisseurModel, number> {

    static endPoint = `${AppSettings.API_ENDPOINT}Fournisseurs/`;

    constructor(protected http: HttpClient) {
        super(http, SuppliersService.endPoint);
    }

}

