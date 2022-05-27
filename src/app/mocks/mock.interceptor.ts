import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mockEndpoints } from './mock.config';

let currentMockEndpoint;

@Injectable()
export class HttpMockApiInterceptor implements HttpInterceptor {
  constructor(){}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(mockEndpoints);
    currentMockEndpoint = mockEndpoints[request.method] && mockEndpoints[request.method][request.url] || null;

    // We are checking if a fake endpoint handler is available, if there is one – using it,
    // otherwise continue with normal call using next.handle(request)
    return currentMockEndpoint ? currentMockEndpoint.handler() : next.handle(request);
  }
}
