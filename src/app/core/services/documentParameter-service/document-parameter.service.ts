import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IResult } from '../../models/general/result-model';
import { Observable } from 'rxjs';
import { IDocumentParametersModel, IDocumentParameters } from '../../models/general/document-parameter.model';
import { AppSettings } from 'src/app/app-settings/app-settings';

@Injectable({
    providedIn: 'root'
})
export class DocumentParameterService {

    static endPoint = `${AppSettings.API_ENDPOINT}DocumentParameters/`;

    constructor(private http: HttpClient) { }

    /**
     * add document parameter
     */
    Add(body: IDocumentParametersModel): Observable<IResult<IDocumentParameters>> {
        return this.http.post<IResult<IDocumentParameters>>(DocumentParameterService.endPoint + 'Create', body);
    }

    /**
     * update document parameter
     */
    Update(documentParamtersId: string, body: IDocumentParametersModel): Observable<IResult<IDocumentParameters>> {
        return this.http.put<IResult<IDocumentParameters>>(DocumentParameterService.endPoint + 'Update/' + documentParamtersId, body);
    }

    /**
     * get document params
     */
    Get(): Observable<IResult<IDocumentParameters>> {
        return this.http.get<IResult<IDocumentParameters>>(DocumentParameterService.endPoint, AppSettings.RequestOptions());
    }

}
