import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { IResult } from 'src/app/core/models/general/result-model';
import { IAdvanceDashboardFilterOption, IDashboardFilterOption } from './../../core/models/general/filter-option.model';
import { IChartData, IRepartitionDossiersTechnicien, IRepartitionTypesTravauxParTechnicien } from './dashboard.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    static endPoint = `${AppSettings.API_ENDPOINT}Dashboard/`;

    constructor(private http: HttpClient) { }

    GetChiffreAffaire(filterOption: IDashboardFilterOption): Observable<IResult<IChartData>> {
        return this.http.post<IResult<IChartData>>(`${DashboardService.endPoint}ChiffreAffaire`, filterOption);
    }

    GetRepartitionTypesTravauxParTechnicien(filterOption: IAdvanceDashboardFilterOption):
        Observable<IResult<IRepartitionTypesTravauxParTechnicien[]>> {
        return this.http.post<IResult<IRepartitionTypesTravauxParTechnicien[]>>
            (`${DashboardService.endPoint}GetRepartitionTypesTravauxParTechnicien`, filterOption);
    }

    GetRepartitionDossiersTechnicien(filterOption: IAdvanceDashboardFilterOption): Observable<IResult<IRepartitionDossiersTechnicien[]>> {
        return this.http.post<IResult<IRepartitionDossiersTechnicien[]>>
            (`${DashboardService.endPoint}GetRepartitionDossiersTechnicien`, filterOption);
    }

}
