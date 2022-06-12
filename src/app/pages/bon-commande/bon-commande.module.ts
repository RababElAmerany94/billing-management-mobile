import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { HttpClient } from '@angular/common/http';
import { BonCommandeShellComponent } from './container/bon-commande-shell/bon-commande-shell.component';
import { ListBonCommandeComponent } from './components/list-bon-commande/list-bon-commande.component';
import { EditBonCommandeComponent } from './components/edit-bon-commande/edit-bon-commande.component';
import { BonCommandeRoutingModule } from './bon-commande-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RaisonAnnulationComponent } from './components/raison-annulation/raison-annulation.component';
import { SignatureBonCommandeComponent } from './components/signature-bon-commande/signature-bon-commande.component';

// Translation
export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/bon-commande/', suffix: '.json' },
    { prefix: './assets/i18n/errors/', suffix: '.json' },
    { prefix: './assets/i18n/shared/', suffix: '.json' },
  ]);
}

@NgModule({
  declarations: [
    BonCommandeShellComponent,
    ListBonCommandeComponent,
    EditBonCommandeComponent,
    RaisonAnnulationComponent,
    SignatureBonCommandeComponent
  ],
  imports: [
    CommonModule,
    BonCommandeRoutingModule,
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  entryComponents: [
    RaisonAnnulationComponent,
    SignatureBonCommandeComponent
  ]
})
export class BonCommandeModule { }
