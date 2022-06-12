import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { BaseService } from './base-service/base.service';
import { ITypeLogementModel, ITypeLogement } from '../models/type-logement/fournisseurs.model';

@Injectable({
    providedIn: 'root'
})
export class TypeLogementService extends BaseService<ITypeLogement, ITypeLogementModel, ITypeLogementModel, number> {

    static endPoint = `${AppSettings.API_ENDPOINT}LogementType/`;

    constructor(protected http: HttpClient) {
        super(http, TypeLogementService.endPoint);
    }

}

