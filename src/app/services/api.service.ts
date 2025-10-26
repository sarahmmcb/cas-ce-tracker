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
    return this.http.get(this.baseUrl + route, { 
      params,
      observe: 'response',
      withCredentials: true
    })
    .pipe(
      map((res: HttpResponse<any>) => {
        if (res.status >= 400) {
          // TODO: figure out a response formate= that guarantees a message property
          // so we can display it here
          throw new Error("An unexpected error occurred");
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
      observe: 'response',
      withCredentials: true
    }).pipe(
      map(res => res.body)
    );
  }

  public put(route: string, body: any, params?: HttpParams): Observable<any> {
    return this.http.put(this.baseUrl + route, JSON.stringify(body), {
      params,
      observe: 'response',
      withCredentials: true
    }).pipe(
      map(res => res.body)
    );
  }
}
