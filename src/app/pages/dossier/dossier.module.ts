import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { DossierShellComponent } from './container/dossier-shell/dossier-shell.component';
import { ListDossierComponent } from './components/list-dossier/list-dossier.component';
import { EditDossierComponent } from './components/edit-dossier/edit-dossier.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { DossierRoutingModule } from './dossier-routing.module';
import { DossierInstallationComponent } from './components/dossier-installation/dossier-installation.component';
import { DossierTabsComponent } from './components/dossier-tabs/dossier-tabs.component';
import { AssignCommercialComponent } from './components/assign-commercial/assign-commercial.component';
import { DossierListTabsComponent } from './components/dossier-list-tabs/dossier-list-tabs.component';
import { AgendaCommercialModule } from '../agenda-commercial/agenda-commercial.module';
import { VisiteTechniqueComponent } from './components/visite-technique/visite-technique.component';
import { AddVisiteTechniqueComponent } from './components/visite-technique/add-visite-technique/add-visite-technique.component';
import { AddTypeVisiteTechniqueComponent } from './components/add-type-visite-technique/add-type-visite-technique.component';

// Translation
export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/agenda-commercial/', suffix: '.json' },
    { prefix: './assets/i18n/dossier/', suffix: '.json' },
    { prefix: './assets/i18n/errors/', suffix: '.json' },
    { prefix: './assets/i18n/shared/', suffix: '.json' },
  ]);
}

@NgModule({
  declarations: [
    DossierShellComponent,
    ListDossierComponent,
    EditDossierComponent,
    DossierInstallationComponent,
    DossierTabsComponent,
    AssignCommercialComponent,
    DossierListTabsComponent,
    VisiteTechniqueComponent,
    AddVisiteTechniqueComponent,
    AddTypeVisiteTechniqueComponent
  ],
  imports: [
    CommonModule,
    DossierRoutingModule,
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    }),
    AgendaCommercialModule
  ],
  entryComponents: [
    AssignCommercialComponent,
    AddVisiteTechniqueComponent,
    AddTypeVisiteTechniqueComponent
  ]
})
export class DossierModule { }
