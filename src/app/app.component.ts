import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import { UserHelper } from './core/helpers/user';
import { ITokenModel } from './core/models/general/token.model';
import { AuthService } from './core/services/auth/auth.service';
import { TranslationService } from './core/services/translation.service';
import { SidebarService } from './core/services/sidebar.service';
import { MenuConfig } from './core/helpers/menu-config';
import { PushNotificationService } from './core/services/push-notification.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

    subSink = new SubSink();

    /** selected index of menu */
    public selectedIndex = 0;

    /** application pages */
    public appPages = MenuConfig.getListPages();

    /** is online */
    isOnline = true;

    /** user token information */
    user: ITokenModel = UserHelper.getTokeInfo();

    currentURL = '';

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private translationService: TranslationService,
        private translate: TranslateService,
        private router: Router,
        private authService: AuthService,
        private sidebarService: SidebarService,
        private menu: MenuController,
        private pushNotificationService: PushNotificationService
    ) {
        this.initializeApp();
        this.translationService.setLanguage(this.translate);
        this.sidebarService.loadMenu(MenuConfig.getListPages());
    }

    /**
     * on init
     */
    ngOnInit() {
        this.suscribeChangeMenu();
        this.subscribeAuthenticationActions();
    }

    /**
     * initialize of app
     */
    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.menu.enable(UserHelper.isAuthenticated());
            this.pushNotificationService.setup();
        });
        this.platform.pause.subscribe(_ => this.pushNotificationService.appClosed());
        this.platform.resume.subscribe(_ => this.pushNotificationService.appOpened());
    }

    suscribeChangeMenu() {
        this.subSink.sink = this.sidebarService.menuConfigState.subscribe(result => {
            this.appPages = result;
            this.currentURL = this.router.url;
            this.selectedIndex = this.appPages.findIndex(page => page.url === this.currentURL);
        });
    }

    /**
     * navigate to page
     * @param selectedIndex the index of pages
     */
    navigateRoute(selectedIndex: number) {
        if (this.appPages[selectedIndex].url === '/log-out') {
            this.router.navigate(['/login']);
            this.menu.enable(false);
            this.pushNotificationService.unsubscribe();
            localStorage.clear();
        }
    }

    /**
     * subscribe of change authentication
     */
    private subscribeAuthenticationActions() {
        this.subSink.sink = this.authService.isAuthenticated$.subscribe(result => {
            if (result) {
                this.user = UserHelper.getTokeInfo();
                this.menu.enable(true);
            } else {
                this.user = null;
                this.menu.enable(false);
            }
        });
    }

}
