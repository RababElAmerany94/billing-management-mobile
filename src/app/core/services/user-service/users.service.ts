import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base-service/base.service';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { IUser, IUserModel } from '../../models/user/userModel';
import { IResult, IPagedResult } from '../../models/general/result-model';
import { ICommercialPlanning } from '../../models/general/commercial-planning.model';
import { ICommercialPlanningFilterOption } from '../../models/general/filter-option.model';

@Injectable({
    providedIn: 'root'
})
export class UsersService extends BaseService<IUser, IUserModel, IUserModel, string> {

    /**
     * the end point for interacting with the Account service
     */
    static endPoint = AppSettings.API_ENDPOINT + 'Account/';
    static endPointPlaning = AppSettings.API_ENDPOINT + 'Account/GetCommercialsPlanning';

    constructor(protected http: HttpClient) {
        super(http, UsersService.endPoint);
    }

    /**
     * Get lite information of user by id
     * @param id Id of user
     */
    GetLite(id: string): Observable<IResult<IUser>> {
        return this.http.get<IResult<IUser>>(AppSettings.API_ENDPOINT + 'Account/Lite/' + id);
    }
    /**
     * fetch technicien planing filters
     * @param filterOptions the filter option
     */
    GetCommercialsPlanning(filterOptions: ICommercialPlanningFilterOption): Observable<IPagedResult<ICommercialPlanning>> {
        return this.http.post<IPagedResult<ICommercialPlanning>>(UsersService.endPointPlaning, filterOptions, AppSettings.RequestOptions());
    }

}
