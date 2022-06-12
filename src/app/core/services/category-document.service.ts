import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICategoryDocument, ICategoryDocumentModel } from '../models/general/category-document.model';
import { BaseService } from './base-service/base.service';
import { AppSettings } from 'src/app/app-settings/app-settings';


@Injectable({
  providedIn: 'root'
})
export class CategoryDocumentService extends BaseService<ICategoryDocument, ICategoryDocumentModel, ICategoryDocumentModel, number> {

    static endPoint = AppSettings.API_ENDPOINT + 'CategoryDocuments/';

    constructor(protected http: HttpClient) {
        super(http, CategoryDocumentService.endPoint);
    }
}
