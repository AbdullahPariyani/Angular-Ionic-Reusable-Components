import { Component, OnInit } from '@angular/core';
import { CapacitorJailbreakRootDetection } from '@evehr/capacitor-jailbreak-root-detection';
import { IonCardContent, IonButton, IonCardHeader, IonCard, IonCardTitle, IonCardSubtitle } from "@ionic/angular/standalone";
import { TranslateModule } from '@ngx-translate/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-jail-broken',
  templateUrl: './jail-broken.component.html',
  styleUrls: ['./jail-broken.component.scss'],
  standalone: true,
  imports: [IonCardSubtitle, IonCardTitle, IonCard, IonCardHeader, IonButton, IonCardContent, TranslateModule]
})
export class JailBrokenComponent {

  timer: number = 10; // Timer start value
  timerSubscription: Subscription | undefined;

  ngOnInit() {
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  startCountdown() {
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.timerSubscription?.unsubscribe();
        CapacitorJailbreakRootDetection.exitApp();
      }
    });
  }

}
