import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface HttpParams {
  [key: string]: string | string[] | number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  public baseUrl: string;

  constructor(private http: HttpClient) {}

  public get(route: string, params?: HttpParams): Observable<any> {
    const headers = {
      method: 'GET'
    };

    return this.http.get(this.baseUrl + route, { 
      headers,
      params,
      observe: 'response'
    })
    .pipe(
      map((res: HttpResponse<any>) => {
        
        if (res.status >= 400) {
          throwError(() => "There was an error"); // revisit this to see how best to handle different kinds of errors
        }

        return res.body;
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  public post(route: string, body: any, params?: HttpParams): Observable<any> {
    return this.http.post(this.baseUrl + route, JSON.stringify(body), {
      params,
      observe: 'response'
    }).pipe(
      map(res => res.body)
    );
  }

  public put(route: string, body: any, params?: HttpParams): Observable<any> {
    return this.http.put(this.baseUrl + route, JSON.stringify(body), {
      params,
      observe: 'response'
    }).pipe(
      map(res => res.body)
    );
  }
}
