import { Platform } from '@ionic/angular/standalone';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APP_CONFIG, mConstant } from '../config/const';
import { LocalStorageService } from './localstorage.service';

@Injectable({
	providedIn: 'root',
})
export class HttpService {
	// httpClient: HttpClient;
	baseUrl: string = environment.apiUrl;
	httpOptions: any;

	constructor(private httpClient: HttpClient, private platform: Platform, private _local: LocalStorageService) {
		this.httpOptions = {
			headers: new HttpHeaders({
				'app-source': this.appSource,
				'app-platform': this.isAndroid ? 'android' : this.isIOS ? 'ios' : 'browser',
				'app-version': APP_CONFIG.APP_VERSION,
			}),
		};
	}

	private get isAndroid() {
		return this.platform.is('android');
	}

	private get isIOS() {
		return this.platform.is('ios');
	}

	private get appSource() {
		return this.isAndroid || this.isIOS ? 'mobile' : 'browser';
	}

	appendToken() {
		const token = this._local.getItem(mConstant.token);
		if (token) {
			this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + token);
		}
	}

	httpGet(endpoint: string = '', queryValues: string = '', httpOptions: any = this.httpOptions): Observable<any> {
		this.appendToken();
		return this.httpClient.get(this.baseUrl + '/' + endpoint + (queryValues ? '/' + queryValues : ''), httpOptions);
	}

	httpPost(endpoint: string = '', data: any, httpOptions: any = this.httpOptions): Observable<any> {
		this.appendToken();
		return this.httpClient.post(this.baseUrl + '/' + endpoint, data, httpOptions);
		//const staticData = { message: 'This is a static response', token: 'token' };
		//return of(staticData); // Using the of operator to create an observable with the static data
		//return this.httpClient.post(this.baseUrl + '/' + endpoint, data, httpOptions);
	}

	httpPut(endpoint: string = '', data: any, httpOptions: any = this.httpOptions): Observable<any> {
		this.appendToken();
		return this.httpClient.put(this.baseUrl + '/' + endpoint, data, httpOptions);
	}

	httpDelete(endpoint: string = '', queryValues: string = '', httpOptions: any = this.httpOptions): Observable<any> {
		this.appendToken();
		return this.httpClient.delete(this.baseUrl + '/' + endpoint + (queryValues ? '/' + queryValues : ''), httpOptions);
	}
}
