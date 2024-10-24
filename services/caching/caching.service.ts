import { Injectable } from '@angular/core';
import { LocalStorageService } from '../localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class CachingService {
  private defaultCacheDuration: number = 12 * 60 * 60 * 1000; // 12 hours in milliseconds(48 * 60 * 60 * 1000), 2 minutes (2*60*1000)

  constructor(private _local: LocalStorageService) {}

  // Set cache duration in milliseconds (default: 48 hours)
  setCacheDuration(duration: number) {
    this.defaultCacheDuration = duration;
  }

  // Store data in cache
  set(key: string, data: any, duration?: number): void {
    const expiry = Date.now() + (duration || this.defaultCacheDuration);
    const cacheItem = { expiry, data };

    // Store the serialized cache item in localStorage
    this._local.setItem(key, JSON.stringify(cacheItem));
  }

  // Get data from cache
  get<T>(key: string): T | null {
    const cacheItemString = this._local.getItem(key);

    if (cacheItemString) {
      const cacheItem = JSON.parse(cacheItemString) as {
        expiry: number;
        data: any;
      };

      if (Date.now() < cacheItem.expiry) {
        return cacheItem.data as T;
      } else {
        this.clear(key);
      }
    }
    return null;
  }

  // Clear specific cache item
  clear(key: string): void {
    this._local.removeItem(key);
  }

  // Clear all cache items
  clearAll(): void {
    localStorage.clear();
    sessionStorage.clear();
  }
}
