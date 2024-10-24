import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import OneSignal from 'onesignal-cordova-plugin';
import { M_APP_CONFIG, mConstant } from '../../config/m-const';
import { MOTOR_CONFIG } from '../../config/api-end-points.config';
import { LocalStorageService } from '../localstorage.service';
import { IOneSignalNotification } from '../../interfaces/global.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  onsSignalSubscriptionID: string | null = '';
  onsSignalID: string | null = '';
  isSubscribedToPushNotifications: boolean;
  constructor(
    private _httpService: HttpService,
    private _local: LocalStorageService,
    private router: Router,
  ) {}

  async OneSignalInit(): Promise<void> {
    let router = this.router;
    let functionCall = this.setNotificationData;
    let httpsRef = this._httpService;

    // NOTE: Update the init value below with your OneSignal AppId.
    await OneSignal.initialize(M_APP_CONFIG.ONE_SIGNAL_NOTIFICATION_ID);

    let myClickListener = async function (event: any) {
      let notificationData = event;
      console.log('OneSignal notification clicked:', notificationData);
      await functionCall(httpsRef);
    };

    await OneSignal.Notifications.addEventListener('click', myClickListener);

    await OneSignal.Notifications.requestPermission().then(
      (accepted: boolean) => {
        this.isSubscribedToPushNotifications = accepted;
        console.log('User accepted notifications: ' + accepted);
      },
    );

    await this.getOneSignalSubscriptionID();
    await this.getOneSignalID();
  }

  private setNotificationData(httpsRef: HttpService) {
    console.log('notifications #####', httpsRef);
  }

  private async getOneSignalSubscriptionID() {
    this.onsSignalSubscriptionID =
      await OneSignal.User.pushSubscription.getIdAsync();
  }

  private async getOneSignalID() {
    this.onsSignalID = await OneSignal.User.getOnesignalId();
  }

  private async askForPermission() {
    await OneSignal.Notifications.requestPermission(true).then(
      (accepted: boolean) => {
        this.isSubscribedToPushNotifications = accepted;
        console.log('User accepted notifications: ' + accepted);
      },
    );
  }

  get getIsSubscribedToPushNotifications(): boolean {
    return this.isSubscribedToPushNotifications;
  }

  private localStorageHelper = (() => {
    // Private method to check IDs
    const checkOneSignalIds = (
      getOneSignalId: string | null,
      getSubscriptionId: string | null,
    ) => {
      const storedObject = this._local.getItem(
        'ONE_SIGNAL_NOTIFICATION_DETAILS',
      );

      if (storedObject) {
        const oneSignalObj = JSON.parse(storedObject);
        const isOneSignalIdMatch =
          oneSignalObj.ONE_SIGNAL_ID === getOneSignalId;
        const isSubscriptionIdMatch =
          oneSignalObj.SUBSCRIPTION_ID === getSubscriptionId;

        return isOneSignalIdMatch && isSubscriptionIdMatch;
      } else {
        console.log('ONE_SIGNAL_OBJ not found in local storage.');
        return false;
      }
    };

    // Public API
    return {
      verifyIds: (
        getOneSignalId: string | null,
        getSubscriptionId: string | null,
      ) => {
        return checkOneSignalIds(getOneSignalId, getSubscriptionId);
      },
    };
  })();

  storeNotificationDetails(id: string) {
    const idsMatch = this.localStorageHelper.verifyIds(
      this.onsSignalID,
      this.onsSignalSubscriptionID,
    );
    if (idsMatch) {
      // console.log('Both IDs match. Not Need Store it again');
    } else {
      if (this.getIsSubscribedToPushNotifications) {
        this._httpService
          .httpPost(MOTOR_CONFIG.STORE_NOTIFICATION_DETAILS, {
            IQAMA_NO: id,
            ONE_SIGNAL_ID: this.onsSignalID,
            SUBSCRIPTION_ID: this.onsSignalSubscriptionID,
          })
          .subscribe((val: IOneSignalNotification) => {
            this._local.setItem('ONE_SIGNAL_NOTIFICATION_DETAILS', val);
          });
      }
    }
  }
}
