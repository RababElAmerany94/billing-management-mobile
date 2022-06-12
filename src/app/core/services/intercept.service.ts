// Angular
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalErrorService } from './global-error.service';

// RxJS
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AppSettings } from 'src/app/app-settings/app-settings';

@Injectable({
    providedIn: 'root',
})
export class InterceptService implements HttpInterceptor {

    constructor(
        private globalErrorService: GlobalErrorService
    ) { }

    // intercept request and add token
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        // modify request
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${localStorage.getItem(AppSettings.TOKEN)}`
            }
        });

        return next.handle(request).pipe(
            tap(
                event => {
                    if (event instanceof HttpResponse) { }
                },
                error => {
                    if (error.status === 0) {
                        this.globalErrorService.add('ERRORS.NO_RESPONSE_SERVER');
                    } else if (error.status === 500 || error.status === 400) {
                        this.globalErrorService.add('ERRORS.SERVER');
                    } else if (error.status === 401 || error.status === 403) {
                        this.globalErrorService.add('ERRORS.UNAUTHORIZED');
                    }
                }
            ),
            finalize(() => {
                // finalize request
            }),
        );
    }
}
