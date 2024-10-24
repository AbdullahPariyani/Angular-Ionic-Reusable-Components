import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonImg, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router'; // Import Router to navigate
import { TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { arrowBack, arrowForward, notifications } from 'ionicons/icons';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-iframe-with-url',
  templateUrl: './iframe-with-url.page.html',
  styleUrls: ['./iframe-with-url.page.scss'],
  standalone: true,
  imports: [IonButton, IonImg, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, SharedModule, IonIcon]
})
export class IframeWithURLPage implements OnInit {

  url: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private alertService: AlertService,
    public _gService: GlobalService,
    private router: Router
  ) {
  }

  ngOnInit() {
    addIcons({ arrowForward, arrowBack });
    this.route.queryParams.subscribe(params => {
      this.url = this.sanitizeUrl(params.url);
    });
  }

  async setupBackButton() {
    await this.alertService.presentAlertConfirm(
      this._gService.translate('CANCEL_DRAFT_ARE_YOU_SURE'),
      () => {
        // this.alertService.closeAlert();
        // console.log('Cancelled navigation'); // Handle cancel action
      },
      () => {
        this.router.navigateByUrl('/home'); // Navigate to home (adjust as needed)
      }
    );
  }


  private sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
