import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IArticle } from 'src/app/core/models/general/article.model';
import { IFicheControleModel } from 'src/app/core/models/dossier/ficheControleModel';
import { IDossierPVModel } from 'src/app/core/models/dossier/dossierPVModel';
import { CheckUserAssignedSameDateAndHourFilterOption } from '../../core/models/general/filter-option.model';
import { BaseService } from 'src/app/core/services/base-service/base.service';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { IDossier, IDossierModel, DossierAssignationModel, IVisteTechnique } from './dossier.model';
import { IResult, IResultBase } from 'src/app/core/models/general/result-model';
import { Memo } from 'src/app/core/models/general/memo.model';

@Injectable({
  providedIn: 'root'
})
export class DossierService extends BaseService<IDossier, IDossierModel, IDossierModel, string> {

  static endPoint = `${AppSettings.API_ENDPOINT}Dossier/`;

  constructor(protected http: HttpClient) {
    super(http, DossierService.endPoint);
  }

  /**
   * Save memos of dossier
   * @param id Id of dossier
   * @param name File name of memos
   */
  SaveMemos(id: string, name: Memo[]): Observable<any> {
    return this.http.post<any>(`${DossierService.endPoint}MemosDossier/Save/${id}`, name, AppSettings.RequestOptions()
    );
  }

  /**
   * check if the given reference is unique
   */
  IsUniqueReference(reference: string): Observable<IResult<boolean>> {
    return this.http.get<IResult<boolean>>(DossierService.endPoint + 'CheckUniqueReference/' + reference, AppSettings.RequestOptions());
  }

  /**
   * Create dossier pv
   * @param body IDossierPV
   */
  CreateDossierPV(body: IDossierPVModel): Observable<IResult<any>> {
    return this.http.post<IResult<any>>(`${this.baseUrl}PV/Create/`, body, AppSettings.RequestOptions());
  }

  /**
   * delete information of dossier pv
   * @param id the id of dossier pv
   */
  DeleteDossierPV(id: string): Observable<IResultBase> {
    return this.http.delete<IResultBase>(`${this.baseUrl}PV/Delete/${id}`, AppSettings.RequestOptions());
  }

  /**
   * update information of Dossier PV
   */
  UpdateDossierPV(id: string, body: IDossierPVModel): Observable<IResult<any>> {
    return this.http.put<IResult<any>>(`${this.baseUrl}PV/Update/${id}`, body, AppSettings.RequestOptions());
  }

  /**
   * article of Dossier PV
   */
  GetArticleDossierPV(id: string): Observable<IResult<IArticle[]>> {
    return this.http.get<IResult<IArticle[]>>(`${this.baseUrl}GetArticle/${id}`, AppSettings.RequestOptions());
  }

  /**
   * Create Fiche De Controle
   * @param body Fiche De Controle
   */
  CreateFicheDeControle(body: IFicheControleModel): Observable<IResult<any>> {
    return this.http.post<IResult<any>>(`${this.baseUrl}FicheControle/Create/`, body, AppSettings.RequestOptions());
  }

  /**
   * delete information of Fiche De Controle
   * @param id the id of Fiche De Controle
   */
  DeleteFicheDeControle(id: string): Observable<IResultBase> {
    return this.http.delete<IResultBase>(`${this.baseUrl}FicheControle/Delete/${id}`, AppSettings.RequestOptions());
  }

  /**
   * update information of Fiche De Controle
   */
  UpdateFicheDeControle(id: string, body: IFicheControleModel): Observable<IResult<any>> {
    return this.http.put<IResult<any>>(`${this.baseUrl}FicheControle/Update/${id}`, body, AppSettings.RequestOptions());
  }

  /**
   * check user already assigned to another dossier in the same date and hour
   */
  CheckUserAssignedSameDateAndHour(filterOption: CheckUserAssignedSameDateAndHourFilterOption): Observable<IResult<boolean>> {
    return this.http.post<IResult<boolean>>(`${DossierService.endPoint}CheckUserAssignedSameDateAndHour`, filterOption);
  }

  /**
   * synchronize order of antsroute with our dossier
   */
  SynchronizeWithAntsroute(id: string): Observable<IResult<IDossierModel>> {
    return this.http.post<IResult<IDossierModel>>(`${DossierService.endPoint}SynchronizeWithAntsroute/${id}`, AppSettings.RequestOptions());
  }

  /**
   * mark dossier planifie
   */
  MarkDossierAplanifier(id: string): Observable<IResult<boolean>> {
    return this.http.post<IResult<boolean>>(`${DossierService.endPoint}MarkDossierAplanifier/${id}`, AppSettings.RequestOptions());
  }

  /**
   * add visite technique with our dossier
   */
  SaveVisteTechnique(id: string, visiteTechnique: IVisteTechnique): Observable<IResult<boolean>> {
    return this.http.post<IResult<boolean>>(`${DossierService.endPoint}VisteTechnique/Save/${id}`, visiteTechnique,
      { headers: new HttpHeaders().append('Content-Type', 'application/json') });
  }

}
