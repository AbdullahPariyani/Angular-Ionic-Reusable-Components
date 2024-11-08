import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  setThemeColor(variable: string, value: string) {
    // Using non-null assertion here
    document.documentElement!.style.setProperty(variable, value);
  }

  setPrimaryColor(color: string) {
    this.setThemeColor('--ion-color-primary', color);
    this.setThemeColor(
      '--ion-color-primary-shade',
      this.shadeColor(color, -0.2),
    );
    this.setThemeColor('--ion-color-primary-tint', this.shadeColor(color, 0.2));
  }

  private shadeColor(color: string, percent: number) {
    const f = parseInt(color.slice(1), 16);
    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;
    const R = f >> 16;
    const G = (f >> 8) & 0x00ff;
    const B = f & 0x0000ff;
    return (
      '#' +
      (
        0x1000000 +
        (Math.round((t - R) * p) + R) * 0x10000 +
        (Math.round((t - G) * p) + G) * 0x100 +
        (Math.round((t - B) * p) + B)
      )
        .toString(16)
        .slice(1)
    );
  }
}
