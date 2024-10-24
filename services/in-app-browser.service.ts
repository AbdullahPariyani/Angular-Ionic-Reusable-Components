import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class InAppBrowserService {
  constructor(private http: HttpClient) { }

  appendQueryParams(url: string, queryParams: { [key: string]: string }): string {
    let newUrl = url;
    let params = new HttpParams();

    // Check if the original URL already has query parameters
    if (url.includes('?')) {
      // Parse the existing query parameters
      const parts = url.split('?');
      newUrl = parts[0]; // Get the base URL
      const paramsStr = parts[1]; // Get the query parameters string

      // Append existing query parameters to HttpParams
      if (paramsStr) {
        const keyValuePairs = paramsStr.split('&');
        for (const pair of keyValuePairs) {
          const [key, value] = pair.split('=');
          params = params.append(key, value);
        }
      }
    }

    // Append the new query parameters
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        params = params.append(key, queryParams[key]);
      }
    }

    // Construct the final URL with updated query parameters
    newUrl = `${newUrl}?${params.toString()}`;

    return newUrl;
  }

  convertToString(dir: string, closebuttoncaption: string): string {
    const config = {
      location: 'no',
      toolbar: 'yes',
      toolbarcolor: '#83786F',
      lefttoright: dir,
      hidenavigationbuttons: 'no',
      closebuttoncolor: '#FFFFFF',
      closebuttoncaption: closebuttoncaption,
      navigationbuttoncolor: '#FFFFFF'
    };

    const configString = Object.entries(config)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}=${value}`;
        } else if (typeof value === 'function') {
          return `${key}=\${${value}}`;
        } else if (typeof value === 'boolean') {
          return `${key}=${value ? 'yes' : 'no'}`;
        } else {
          return `${key}=${JSON.stringify(value)}`;
        }
      })
      .join(',');

    return configString;
  }
}
