import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { IResult, IResultBase } from '../../models/general/result-model';
import { FileManagerModel } from '../../models/general/file-manager.model';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  static endPoint = AppSettings.API_ENDPOINT + 'FileManager/';

  constructor(private http: HttpClient) { }

  /**
   * Get file by name
   * @param name name of file
   */
  Get(name: string): Observable<IResult<string>> {
    return this.http.get<IResult<string>>(`${FileManagerService.endPoint}${name}`, AppSettings.RequestOptions());
  }

  /**
   * Add files
   * @param body list of file
   */
  Add(body: FileManagerModel[]): Observable<IResultBase> {
    return this.http.post<IResultBase>(`${FileManagerService.endPoint}Create`, body, AppSettings.RequestOptions());
  }

  /**
   * Delete file by name
   * @param name name of file
   */
  Delete(name: string): Observable<IResultBase> {
    return this.http.delete<IResultBase>(`${FileManagerService.endPoint}${name}`, AppSettings.RequestOptions());
  }

  /**
   * Delete file by name
   * @param name name of file
   */
  DeleteList(names: string[]): Observable<IResultBase> {
    return this.http.post<IResultBase>(`${FileManagerService.endPoint}DeleteList`, names, AppSettings.RequestOptions());
  }
}
