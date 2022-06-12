import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AppSettings } from 'src/app/app-settings/app-settings';

@Injectable({
    providedIn: 'root'
})
export class PushNotificationService {

    isAppOpen = true;

    constructor(
        private oneSignal: OneSignal,
        private localNotifications: LocalNotifications
    ) { }

    /**
     * set user
     * @param userId the id of user
     */
    setUserId(userId: string) {
        this.oneSignal.setExternalUserId(userId);
    }

    /**
     * subscribe notification
     */
    subscribe() {
        this.oneSignal.setSubscription(true);
    }

    /**
     * unsubscribe notification
     */
    unsubscribe() {
        this.oneSignal.setSubscription(false);
    }

    /**
     * the app open to receive local notification
     */
    appOpened() {
        this.isAppOpen = true;
    }

    /**
     * the app closed to receive notification from one signal
     */
    appClosed() {
        this.isAppOpen = false;
    }

    /**
     * setup notification
     */
    setup() {
        const config = AppSettings.OneSignalConfiguration;
        this.oneSignal.startInit(config.appId, config.senderId);
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

        // Notification was received in general
        this.oneSignal.handleNotificationReceived().subscribe(data => {
            // handle received of an notification
            if (this.isAppOpen) {
                const msg = data.payload.body;
                const title = data.payload.title;
                const additionalData = data.payload.additionalData;
                this.sendLocalNotification(title, msg, additionalData);
            }
        });

        // Notification was really clicked/opened
        this.oneSignal.handleNotificationOpened().subscribe(_ => {
            // handle data if notification if we need it
        });

        this.oneSignal.endInit();
    }

    /**
     * send notification locally
     * @param title the title of notification
     * @param msg the message of notification
     * @param data the data of notification
     */
    private sendLocalNotification(title: string, msg: string, data: any) {
        this.localNotifications.schedule({
            id: Math.floor((1 + Math.random()) * 0x10000),
            title,
            text: msg,
            data
        });
    }

}
