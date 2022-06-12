import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { IDocumentParametersModel } from 'src/app/core/models/general/document-parameter.model';
import { IMailHistoryModel, IMailModel } from 'src/app/core/models/general/mail.model';
import { IResult } from 'src/app/core/models/general/result-model';
import { BaseService } from 'src/app/core/services/base-service/base.service';
import { IBonCommande, IBonCommandeModel } from './bon-commande.model';

@Injectable({
    providedIn: 'root'
})
export class BonCommandeService extends BaseService<IBonCommande, IBonCommandeModel, IBonCommandeModel, string> {

    /**
     * the end point for interacting with the BonCommande service
     */
    static endPoint = AppSettings.API_ENDPOINT + 'BonCommande/';

    constructor(protected http: HttpClient) {
        super(http, BonCommandeService.endPoint);
    }

    /**
     * download pdf BonCommande
     * @param id the id of BonCommande
     */
    DownloadPdf(id: string): Observable<IResult<any>> {
        return this.http.get<IResult<any>>(`${BonCommandeService.endPoint}GeneratePDF/${id}`);
    }

    /**
     * check if the given reference is unique
     */
    IsUniqueReference(reference: string): Observable<IResult<boolean>> {
        return this.http.get<IResult<boolean>>(BonCommandeService.endPoint + 'CheckUniqueReference/' + reference);
    }

    /**
     * generate example PDF BonCommande
     * @param body the parameters by default of BonCommande
     */
    ExampleGeneratePDF(body: IDocumentParametersModel): Observable<IResult<any>> {
        return this.http.post<IResult<any>>(`${BonCommandeService.endPoint}ExampleGeneratePDF`, body);
    }

    /**
     * send facture in email
     * @param factureId the id of facture
     * @param body the email information (email to, subject, body)
     */
    SendEmail(factureId: string, body: IMailModel): Observable<IResult<IMailHistoryModel[]>> {
        return this.http.post<IResult<IMailHistoryModel[]>>(`${BonCommandeService.endPoint}SendEmail/${factureId}`, body);
    }
}
