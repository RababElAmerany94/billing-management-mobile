import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { SharedModule } from 'src/app/shared/shared.module';
import { DevisRoutingModule } from './devis-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { DevisShellComponent } from './container/devis-shell/devis-shell.component';
import { ListDevisComponent } from './components/list-devis/list-devis.component';
import { EditDevisComponent } from './components/edit-devis/edit-devis.component';
import { PopUpStatusComponent } from './components/pop-up-status/pop-up-status.component';

// Translation
export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: './assets/i18n/devis/', suffix: '.json' },
        { prefix: './assets/i18n/errors/', suffix: '.json' },
        { prefix: './assets/i18n/shared/', suffix: '.json' },
    ]);
}

@NgModule({
    declarations: [
        DevisShellComponent,
        ListDevisComponent,
        EditDevisComponent,
        PopUpStatusComponent,
    ],
    imports: [
        CommonModule,
        DevisRoutingModule,
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
        PopUpStatusComponent,
    ]
})
export class DevisModule { }
