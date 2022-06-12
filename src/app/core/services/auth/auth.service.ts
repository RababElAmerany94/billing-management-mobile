import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { ILoginModel } from '../../models/user/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = new Subject<boolean>();
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * login
   */
  Login(userName: string, password: string): Observable<ILoginModel> {
    const bodyLogin = { userName, password };
    return this.http.post<ILoginModel>(AppSettings.API_ENDPOINT + 'Account/Login', bodyLogin);
  }

  /**
   * emit actions of authentication
   * @param isAuthenticated is a user authenticated
   */
  IsAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticated.next(isAuthenticated);
  }

}
