import { Injectable, isDevMode } from '@angular/core';
import { HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  httpError = new BehaviorSubject<any>(null);

  constructor(
    private _gService: GlobalService
  ) { }

  handleHttpError(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `${(error.error || {}).Message || (error.error || {}).message || error.message}`;
      // VP: Log to DB???
      if ((error.error || {}).Code !== 100) {
        // Skipping delete 404 error
        this.httpError.next(error);
      }
    }
    //this._gService.progressSpinner = false;
    this._gService.hideLoading();

    if (error.status != 504) {
      this._gService.toast(errorMessage, 'error');
    }

    if (isDevMode()) {
      console.log(errorMessage);
    }

    return throwError(errorMessage);
  }
}
