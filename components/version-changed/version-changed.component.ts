import { Component, Input, OnInit } from '@angular/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GlobalService } from '../../services/global.service';
import { APP_CONFIG } from '../../config/const';

@Component({
	selector: 'app-version-changed',
	templateUrl: './version-changed.component.html',
	styleUrls: ['./version-changed.component.scss'],
	standalone: true,
	imports: [IonButton, IonCardTitle, IonCardSubtitle, IonCardHeader, IonCardContent, IonCard, TranslateModule],
})
export class VersionChangedComponent implements OnInit {
	APP_VERSION = APP_CONFIG.APP_VERSION;
	constructor(public _gService: GlobalService) {}

	ngOnInit() {
		this.APP_VERSION = APP_CONFIG.APP_VERSION;
	}

	updateNow() {
		if (this._gService.platformDetails.ios) {
			window.open('https://apps.apple.com/us/app/whatsapp-messenger/id310633997', '_blank');
		}
		if (this._gService.platformDetails.android) {
			window.open('https://play.google.com/store/apps/details?id=com.whatsapp&hl=en', '_blank');
		}
	}
}
