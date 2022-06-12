import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForgetPasswordComponent } from './forget-password.component';

// Translation
export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/login/', suffix: '.json' },
    { prefix: './assets/i18n/shared/', suffix: '.json' },
    { prefix: './assets/i18n/errors/', suffix: '.json' },
  ]);
}

const routes: Routes = [{
  path: '',
  component: ForgetPasswordComponent
}];
@NgModule({
  declarations: [ForgetPasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    })
  ]
})

export class ForgetPasswordModule { }
