import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base-service/base.service';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { ISpecialArticle, ISpecialArticleModel } from '../models/special-article/special-artical.model';

@Injectable({
    providedIn: 'root'
})
export class SpecialArticleService extends BaseService<ISpecialArticle, ISpecialArticleModel, ISpecialArticleModel, number> {

    static endPoint = AppSettings.API_ENDPOINT + 'SpecialArticle/';

    constructor(protected http: HttpClient) {
        super(http, SpecialArticleService.endPoint);
    }

}
