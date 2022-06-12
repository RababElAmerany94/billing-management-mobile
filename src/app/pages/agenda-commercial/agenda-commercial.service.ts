import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ICheckRdvIsExistModel, IEchangeCommercial, IEchangeCommercialModel } from './echange-commercial.model';
import { BaseService } from 'src/app/core/services/base-service/base.service';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { IResult, IResultBase } from 'src/app/core/models/general/result-model';
import { Memo } from 'src/app/core/models/general/memo.model';

@Injectable({
    providedIn: 'root'
})
export class AgendaCommercialService extends BaseService<IEchangeCommercial, IEchangeCommercialModel, IEchangeCommercialModel, string> {

    static endPoint = `${AppSettings.API_ENDPOINT}EchangeCommercial/`;

    constructor(protected http: HttpClient) {
        super(http, AgendaCommercialService.endPoint);
    }

    /**
     * Save memos of agenda commercial
     * @param id Id of agenda commercial
     * @param name File name of memos
     */
    SaveMemos(id: string, name: Memo[]): Observable<any> {
        return this.http.post<any>(`${AgendaCommercialService.endPoint}Memos/Save/${id}`, name, AppSettings.RequestOptions()
        );
    }

    /**
     * synchronization commercial exchanges with google calendar
     */
    SynchronizationWithGoogleCalendar(): Observable<IResultBase> {
        return this.http.post<IResultBase>(`${AgendaCommercialService.endPoint}SynchronizationWithGoogleCalendar/`,
            { headers: new HttpHeaders().append('Content-Type', 'application/json') });
    }

    /**
     * check RDV is exist
     */
    CheckRdvIsExist(body: ICheckRdvIsExistModel): Observable<IResult<boolean>> {
        return this.http.post<IResult<boolean>>(`${AgendaCommercialService.endPoint}CheckRdvIsExist/`, body);
    }
}
