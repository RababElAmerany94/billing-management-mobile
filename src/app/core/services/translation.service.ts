import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'src/app/app-settings/app-settings';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {

    constructor() { }

    setLanguage(translate: TranslateService) {
        translate.setDefaultLang(AppSettings.lang);
        return translate.use(AppSettings.lang);
    }
}
