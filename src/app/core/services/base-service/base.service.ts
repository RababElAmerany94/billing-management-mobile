import { Observable } from 'rxjs';
import { IFilterOption } from '../../models/general/filter-option.model';
import { IResultBase, IPagedResult, IResult } from '../../models/general/result-model';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/app-settings/app-settings';


/**
 * an interface describe base service methods
 */
export interface IBaseService<T, TCreateModel, TUpdateModel, Key> {
    GetAsPagedResult(filterOptions: IFilterOption): Observable<IPagedResult<T>>;
    Delete(id: Key): Observable<IResultBase>;
    Get(id: Key): Observable<IResult<T>>;
    Update(id: string, body: TUpdateModel): Observable<IResult<T>>;
    Add(body: TCreateModel): Observable<IResult<T>>;
}
/**
 * an abstract class define base services
 */
export abstract class BaseService<T, TCreateModel, TUpdateModel, Key> implements IBaseService<T, TCreateModel, TUpdateModel, Key> {

    constructor(
        protected http: HttpClient,
        protected baseUrl: string
    ) { }

    /**
     * get the list of T as paged results
     * @param filterOptions the filter option to filter with it to get the paged result
     */
    GetAsPagedResult<TFilterOption extends IFilterOption>(filterOptions: TFilterOption): Observable<IPagedResult<T>> {
        return this.http.post<IPagedResult<T>>(this.baseUrl, filterOptions, AppSettings.RequestOptions());
    }

    /**
     * delete information of T
     * @param id the id of T
     */
    Delete(id: Key): Observable<IResultBase> {
        return this.http.delete<IResultBase>(`${this.baseUrl}Delete/${id}`, AppSettings.RequestOptions());
    }

    /**
     * display information of T
     * @param id id of T
     */
    Get(id: Key): Observable<IResult<T>> {
        return this.http.get<IResult<T>>(`${this.baseUrl}${id}`, AppSettings.RequestOptions());
    }

    /**
     * update information of T
     */
    Update(id: string, body: TUpdateModel): Observable<IResult<T>> {
        return this.http.put<IResult<T>>(`${this.baseUrl}Update/${id}`, body, AppSettings.RequestOptions());
    }

    /**
     * Create T
     * @param body TCreateModel
     */
    Add(body: TCreateModel): Observable<IResult<T>> {
        return this.http.post<IResult<T>>(`${this.baseUrl}Create`, body, AppSettings.RequestOptions());
    }
}

