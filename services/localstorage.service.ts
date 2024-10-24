// local-storage.service.ts

import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private readonly SECRET_KEY = 'your-secret-key-for-encryption';

  constructor() { }

  // Method to encrypt and set a value in local storage
  setItem(key: string, value: any): void {
    const encryptedValue = CryptoJS.AES.encrypt(JSON.stringify(value), this.SECRET_KEY).toString();
    localStorage.setItem(key, encryptedValue);
  }

  // Method to decrypt and get a value from local storage
  getItem(key: string): any {
    const encryptedValue = localStorage.getItem(key);
    if (encryptedValue) {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, this.SECRET_KEY);
      const decryptedValue = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedValue;
    }
    return null;
  }

  // Method to remove a value from local storage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Method to clear all values from local storage
  clear(): void {
    localStorage.clear();
  }
}
