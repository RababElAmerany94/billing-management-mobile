import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { ITypeChauffage, ITypeChauffageModel } from '../models/type-chauffage/type-chauffage.model';
import { BaseService } from './base-service/base.service';

@Injectable({
    providedIn: 'root'
})
export class TypeChauffageService extends BaseService<ITypeChauffage, ITypeChauffageModel, ITypeChauffageModel, number> {

    static endPoint = `${AppSettings.API_ENDPOINT}TypeChauffage/`;

    constructor(protected http: HttpClient) {
        super(http, TypeChauffageService.endPoint);
    }

}
