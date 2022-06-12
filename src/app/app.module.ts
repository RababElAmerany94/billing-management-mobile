import { NgModule, Injector, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
/** splash screen */
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

/** status bar */
import { StatusBar } from '@ionic-native/status-bar/ngx';

/** camera plugin */
import { Camera } from '@ionic-native/camera/ngx';

/** Translate modules */
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

/** Forms module */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/** angular animations  */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Local
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

// photo viewer
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

// calculation services 
import { CalculationToken } from './core/helpers/calculation/icalculation';
import { Calculation } from './core/helpers/calculation/calculation';

// interceptor
import { InterceptService } from './core/services/intercept.service';

// one signal
import { OneSignal } from '@ionic-native/onesignal/ngx';

// local notification
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: './assets/i18n/menu/', suffix: '.json' },
        { prefix: './assets/i18n/errors/', suffix: '.json' },
        { prefix: './assets/i18n/shared/', suffix: '.json' },
    ]);
}

export let InjectorInstance: Injector;

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: true
        })
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Camera,
        FileOpener,
        File,
        FileChooser,
        FilePath,
        IOSFilePicker,
        Base64,
        PhotoViewer,
        OneSignal,
        LocalNotifications,
        {
            provide: RouteReuseStrategy,
            useClass: IonicRouteStrategy
        },
        {
            provide: CalculationToken,
            useClass: Calculation
        },
        {
            provide: LOCALE_ID,
            useValue: 'fr-FR'
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptService,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

    constructor(private injector: Injector) {
        InjectorInstance = this.injector;
    }
}
