import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/core/services/base-service/base.service';
import { AppSettings } from '../../app-settings/app-settings';
import { IAgendaConfigModel } from '../models/general/agenda-config.model';
import { IAgendaConfig } from '../../pages/agenda-commercial/echange-commercial.model';

@Injectable({
    providedIn: 'root'
})
export class AgendaEvenementService extends BaseService<IAgendaConfig, IAgendaConfigModel, IAgendaConfigModel, string> {

    static endPoint = `${AppSettings.API_ENDPOINT}AgendaEvenement/`;

    constructor(protected http: HttpClient) {
        super(http, AgendaEvenementService.endPoint);
    }

}
