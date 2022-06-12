import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { SharedModule } from 'src/app/shared/shared.module';
import { EvenementAgendaComponent } from './components/evenement-agenda/evenement-agenda.component';
import { EvenementDossierComponent } from './components/evenement-dossier/evenement-dossier.component';
import { EvolutionCaComponent } from './components/evolution-ca/evolution-ca.component';
import {
    RepartitionDossiersParTechnicienComponent
} from './components/repartition-dossiers-par-technicien/repartition-dossiers-par-technicien.component';
import { RepartitionTypesTravauxParTechnicienComponent } from './components/repartition-types-travaux-par-technicien/repartition-types-travaux-par-technicien.component';
import { DashboardPage } from './containers/dashboard-shell/dashboard.page';
import { DashboardPageRoutingModule } from './dashboard-routing.module';

// Translation
export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: './assets/i18n/menu/', suffix: '.json' },
        { prefix: './assets/i18n/dashboard/', suffix: '.json' },
        { prefix: './assets/i18n/errors/', suffix: '.json' },
        { prefix: './assets/i18n/shared/', suffix: '.json' },
    ]);
}

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DashboardPageRoutingModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: true
        })
    ],
    declarations: [
        DashboardPage,
        EvolutionCaComponent,
        EvenementDossierComponent,
        EvenementAgendaComponent,
        RepartitionDossiersParTechnicienComponent,
        RepartitionTypesTravauxParTechnicienComponent
    ]
})
export class DashboardPageModule { }
