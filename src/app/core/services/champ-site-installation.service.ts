import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { IChampSiteInstallation, IChampSiteInstallationModel } from '../models/general/champ-site-installation.model';
import { IResult } from '../models/general/result-model';
import { BaseService } from './base-service/base.service';

@Injectable({
    providedIn: 'root'
})
export class ChampSiteInstallationService
    extends BaseService<IChampSiteInstallation, IChampSiteInstallationModel, IChampSiteInstallationModel, string>  {

    private static endPoint = `${AppSettings.API_ENDPOINT}ChampsSiteInstallation/`;

    constructor(protected http: HttpClient) {
        super(http, ChampSiteInstallationService.endPoint);
    }

    /**
     * get the list
     */
    GetAll(): Observable<IResult<IChampSiteInstallation[]>> {
        return this.http.get<IResult<IChampSiteInstallation[]>>(`${ChampSiteInstallationService.endPoint}`);
    }

}
