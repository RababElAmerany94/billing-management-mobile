import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { NgCalendarModule } from 'ionic2-calendar';
import { SharedModule } from './../../shared/shared.module';
import { AgendaCommercialRoutingModule } from './agenda-commercial-routing.module';
import { EditComponent } from './components/edit/edit.component';
import { ListComponent } from './components/list/list.component';
import { TabsAgendaCommercialComponent } from './components/tabs-agenda-commercial/tabs-agenda-commercial.component';
import { TabsDetailAgendaCommercialComponent } from './components/tabs-detail-agenda-commercial/tabs-detail-agenda-commercial.component';
import { AgendaCommercialShellComponent } from './container/agenda-commercial-shell/agenda-commercial-shell.component';
import { AgendaComponent } from './components/agenda/agenda.component';

// Translation
export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: './assets/i18n/agenda-commercial/', suffix: '.json' },
        { prefix: './assets/i18n/errors/', suffix: '.json' },
        { prefix: './assets/i18n/shared/', suffix: '.json' },
    ]);
}

@NgModule({
    declarations: [
        AgendaCommercialShellComponent,
        TabsAgendaCommercialComponent,
        EditComponent,
        ListComponent,
        AgendaComponent,
        TabsDetailAgendaCommercialComponent,
    ],
    imports: [
        CommonModule,
        AgendaCommercialRoutingModule,
        SharedModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: true
        }),
        NgCalendarModule,
    ],
    exports: [
        AgendaComponent,
    ]
})
export class AgendaCommercialModule { }
