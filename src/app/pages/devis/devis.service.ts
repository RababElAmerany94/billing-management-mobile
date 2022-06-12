import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IMailHistoryModel, IMailModel } from 'src/app/core/models/general/mail.model';
import { IResult } from 'src/app/core/models/general/result-model';
import { BaseService } from 'src/app/core/services/base-service/base.service';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { IDevis, IDevisModel, DevisSignatureModel } from './devis.model';

@Injectable({
  providedIn: 'root'
})
export class DevisService extends BaseService<IDevis, IDevisModel, IDevisModel, string> {

  static endPoint = `${AppSettings.API_ENDPOINT}Devis/`;

  constructor(protected http: HttpClient) {
    super(http, DevisService.endPoint);
  }

  /**
   * check if the given reference is unique
   */
  IsUniqueReference(reference: string): Observable<IResult<boolean>> {
    return this.http.get<IResult<boolean>>(DevisService.endPoint + 'CheckUniqueReference/' + reference, AppSettings.RequestOptions());
  }

  /**
   *  body signature devis
   */
  SignDevis(body: DevisSignatureModel): Observable<IResult<IDevis>> {
    return this.http.post<IResult<IDevis>>(`${DevisService.endPoint}SignDevis`, body, AppSettings.RequestOptions());
  }

  /**
   * download pdf devis
   * @param id the id of devis
   */
  DownloadPdf(id: string): Observable<IResult<any>> {
    return this.http.get<IResult<any>>(`${DevisService.endPoint}GeneratePDF/${id}`);
  }

  /**
   * send devis in email
   * @param devisId the id of devis
   * @param body the email information (emails to, subject, body)
   */
  SendEmail(devisId: string, body: IMailModel): Observable<IResult<IMailHistoryModel[]>> {
    return this.http.post<IResult<IMailHistoryModel[]>>(`${DevisService.endPoint}SendEmail/${devisId}`, body, AppSettings.RequestOptions());
  }
}
