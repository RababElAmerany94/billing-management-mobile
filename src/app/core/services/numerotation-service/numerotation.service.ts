import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { NumerationType } from '../../enums/numerotation.enum';
import { IResult } from '../../models/general/result-model';
import { INumeration } from '../../models/general/numerotation.model';
import { Observable } from 'rxjs';
import { ReferenceResultModel } from '../../models/general/reference-result-model';
import { IBodyReferenceDocumentComptable } from '../../models/general/filter-option.model';

@Injectable({
  providedIn: 'root'
})
export class NumerotationService {
  /**
   * the api end point of the numerotation service
   */
  public static endPoint = `${AppSettings.API_ENDPOINT}Numerotation/`;

  constructor(private http: HttpClient) { }

  /**
   * Generate the numerotation with the given id
   * @param type the type of the numerotation to retrieve
   */
  GenerateNumerotation(type: NumerationType): Observable<IResult<INumeration>> {
    return this.http.get<IResult<INumeration>>(NumerotationService.endPoint + 'Generate/' + type, AppSettings.RequestOptions());
  }
  /**
   * generate reference accounting document
   * @param body the body
   */
  GenerateNumerotationDocumentComptable(body: IBodyReferenceDocumentComptable): Observable<IResult<ReferenceResultModel>> {
    return this.http.post<IResult<ReferenceResultModel>>(`${NumerotationService.endPoint}GenerateReferenceDocumentComptable`,
      body, AppSettings.RequestOptions());
  }
}