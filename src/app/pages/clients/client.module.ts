import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClientRoutingModule } from './client-routing.module';
import { EditClientComponent } from './components/edit-client/edit-client.component';
import { ListClientComponent } from './components/list-client/list-client.component';
import { ClientShellComponent } from './container/client-shell/client-shell.component';
import { ClientTabsComponent } from './components/client-tabs/client-tabs.component';
import { ShowTabsComponent } from './components/client-tabs-show/client-tabs-show.component';
import { AgendaCommercialModule } from './../agenda-commercial/agenda-commercial.module';

// Translation
export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/agenda-commercial/', suffix: '.json' },
    { prefix: './assets/i18n/clients/', suffix: '.json' },
    { prefix: './assets/i18n/errors/', suffix: '.json' },
    { prefix: './assets/i18n/shared/', suffix: '.json' },
  ]);
}

@NgModule({
  declarations: [
    ClientShellComponent,
    ListClientComponent,
    EditClientComponent,
    ClientTabsComponent,
    ShowTabsComponent,
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
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
  ]
})
export class ClientModule { }
