import { Injectable, signal } from '@angular/core';
import mockDataJson from 'src/app/data/data.json';
import {
  Platform,
  NavController,
  AlertController,
  ToastController,
  LoadingController,
} from '@ionic/angular/standalone';
import { App_Direction, Language, PlatformType } from '../enums/shared.enum';
import { TranslateService } from '@ngx-translate/core';
import { mConstant } from '../config/m-const';
import { LocalStorageService } from './localstorage.service';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { InAppBrowserService } from './in-app-browser.service';
import { NotificationService } from './notification/notification.service';
import {
  CapacitorJailbreakRootDetection,
  JailbreakRootResult,
} from '@evehr/capacitor-jailbreak-root-detection';
import { App } from '@capacitor/app';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  mockData = mockDataJson;
  isAR$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isDeviceJailbroken = signal(false);

  platformDetails: Record<PlatformType, boolean> = {
    [PlatformType.Desktop]: false,
    [PlatformType.Android]: false,
    [PlatformType.iOS]: false,
  };

  constructor(
    private platform: Platform,
    private _translate: TranslateService,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private _local: LocalStorageService,
    private toastController: ToastController,
    private _notification: NotificationService,
  ) {
    this.initializePlatformDetails();
  }

  initializePlatformDetails(): void {
    this.platform.ready().then(async () => {
      this.platformDetails[PlatformType.Desktop] = this.platform.is(
        PlatformType.Desktop,
      );
      this.platformDetails[PlatformType.Android] = this.platform.is(
        PlatformType.Android,
      );
      this.platformDetails[PlatformType.iOS] = this.platform.is(
        PlatformType.iOS,
      );
      this.isAR$.next(
        this._local.getItem(mConstant.language) == Language.Arabic,
      );

      if (!(this.platform.is('desktop') || this.platform.is('mobileweb'))) {
        await this._notification.OneSignalInit();
        this.checkJailbreakRootDetection();
        this.resumeApp();
      }
    });
  }

  getPlatformDetails(): Record<PlatformType, boolean> {
    return this.platformDetails;
  }

  convertDateToYMD(date: string) {
    return moment(new Date(date)).format('YYYY/MM/DD');
  }

  convertDateToMDY(date: string) {
    return moment(new Date(date)).format('MM/DD/YYYY');
  }

  convertDateToDMY(date: string) {
    return moment(new Date(date)).format('DD/MM/YYYY');
  }

  convertDate(
    date: string,
    formate:
      | 'YYYY-MM-DD'
      | 'DD-MM-YYYY'
      | 'MM-DD-YYYY'
      | 'YYYY/MM/DD'
      | 'DD/MM/YYYY'
      | 'MM/DD/YYYY',
  ): string {
    // Parse the date string using Moment.js
    const parsedDate = moment(date, formate);

    // Format the date as MM-DD-YYYY
    const formattedDate = parsedDate.format(formate);
    return formattedDate;
  }

  // Loading Code Start
  loadingObject: any;
  async showLoading() {
    if (this.loadingObject) this.loadingObject.dismiss();

    this.loadingObject = await this.loadingCtrl.create({
      message: this.translate('ALERTS_LOADING_WAIT'),
    });

    this.loadingObject.present();
  }

  public async showAlert(
    headerKey: string,
    messageKey: string,
    doNotTranslate?: boolean,
  ) {
    let alert = await this.alertCtrl.create({
      header: doNotTranslate ? headerKey : this.translate(headerKey),
      message: doNotTranslate ? headerKey : this.translate(messageKey),
      buttons: [this.translate('ALERTS_OK')],
    });
    await alert.present();
  }

  async hideLoading() {
    if (this.loadingObject)
      this.loadingObject
        .dismiss()
        .then(() => console.log('dismissed'))
        .catch((e: any) => console.log(e));
  }
  // Loading Code End

  translate(key: string): string {
    return this._translate.instant(key);
  }

  changeLanguage(newLang: string) {
    this._translate.use(newLang);
    this._local.setItem(mConstant.language, newLang);
    this._translate.setDefaultLang(newLang);
    document.documentElement.dir =
      newLang === Language.English
        ? App_Direction.RIGHT_TO_LEFT
        : App_Direction.LEFT_TO_RIGHT;
    document.body.classList.toggle('lang-ar', newLang === Language.Arabic);
    this.isAR$.next(newLang === Language.Arabic);
  }

  hasValue(value: any): boolean {
    if (value && value != '') {
      return true;
    }
    return false;
  }

  async toast(
    message: string,
    errorType: 'success' | 'error' | 'warning' = 'error',
    duration: number = 1500,
    position: 'top' | 'middle' | 'bottom' = 'bottom',
  ) {
    let color: 'primary' | 'danger' | 'warning'; // Default to primary
    if (errorType === 'error') {
      color = 'danger';
    } else if (errorType === 'warning') {
      color = 'warning';
    } else {
      color = 'primary';
    }

    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: color,
      swipeGesture: 'vertical',
      position: position,
    });

    await toast.present();
  }

  checkJailbreakRootDetection() {
    if (this.platformDetails.desktop) {
      this.isDeviceJailbroken.set(false);
    } else {
      CapacitorJailbreakRootDetection.isJailbrokenOrRooted().then(
        (result: JailbreakRootResult) => {
          this.isDeviceJailbroken.apply(result?.result);
        },
      );
    }
  }

  private resumeListener: any;
  // When User reopen the app from background below function will be executed
  private resumeApp() {
    this.resumeListener = App.addListener('appStateChange', (state) => {
      if (state.isActive) {
        this.checkJailbreakRootDetection();
      }
    });
  }

  ngOnDestroy() {
    if (this.resumeListener) {
      this.resumeListener.remove();
    }
  }
}
