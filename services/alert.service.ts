// alert.service.ts

import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from './global.service';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    private currentAlert: any;

    constructor(
        private alertController: AlertController,
        private _gService: GlobalService
    ) { }

    async presentAlertConfirm(message: string, onCancelCallback: () => void, onOkayCallback: () => void) {
        const alert = await this.alertController.create({
            // header: 'Confirm',
            message: message,
            buttons: [
                {
                    text: this._gService.translate('YES'),
                    handler: () => {
                        if (onOkayCallback) {
                            onOkayCallback(); // Execute okay callback
                        }
                    }
                },
                {
                    text: this._gService.translate('NO'),
                    role: 'cancel',
                    handler: () => {
                        if (onCancelCallback) {
                            onCancelCallback(); // Execute cancel callback
                        }
                    }
                },
            ]
        });
        this.currentAlert = alert;
        await alert.present();
    }

    closeAlert() {
        if (this.currentAlert) {
            this.currentAlert.closeAlert();
        }
    }
}
