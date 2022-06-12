import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/core/services/base-service/base.service';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResult } from 'src/app/core/models/general/result-model';
import { IClient, IClientModel } from './client.model';
import { Memo } from 'src/app/core/models/general/memo.model';

@Injectable({
    providedIn: 'root'
})
export class ClientsService extends BaseService<IClient, IClientModel, IClientModel, string> {

    static endPoint = `${AppSettings.API_ENDPOINT}Clients/`;

    constructor(protected http: HttpClient) {
        super(http, ClientsService.endPoint);
    }

    /**
     * check if the given reference is unique
     */
    IsUniqueReference(reference: string): Observable<IResult<boolean>> {
        return this.http.get<IResult<boolean>>(ClientsService.endPoint + 'CheckUniqueReference/' + reference, AppSettings.RequestOptions());
    }

    /**
     * save memo of client
     * @param id id of memo
     * @param name name of memo
     */
    SaveMemos(id: string, name: Memo[]): Observable<any> {
        return this.http.post<any>(`${ClientsService.endPoint}Memos/Save/${id}`, name,
            { headers: new HttpHeaders().append('Content-Type', 'application/json') }
        );
    }

    /**
     *  Export clients format excel
     */
    ExporterExcel() {
        return this.http.get<any>(`${ClientsService.endPoint}ExporterExcel`,
            { headers: new HttpHeaders().append('Content-Type', 'application/json') });
    }

}
