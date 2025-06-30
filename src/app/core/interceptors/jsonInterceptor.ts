import { HttpHandlerFn, HttpHeaders, HttpRequest } from "@angular/common/http";

export function jsonIntercepter(request: HttpRequest<unknown>, next: HttpHandlerFn) {

    request = request.clone({headers: request.headers.set('Content-Type', 'application/json')});

    if (!request.headers.has('Accept')) {
        request = request.clone({headers: request.headers.set('Accept', 'application/json')});
    }

    return next(request);
}