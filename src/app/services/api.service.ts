import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface HttpParams {
  [key: string]: string | string[] | number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public baseUrl = 'api';

  constructor(private http: HttpClient) {}

  public get(route: string, params?: HttpParams): Observable<any> {
    const headers = {
      method: 'GET'
    };
    return this.http.get(this.baseUrl + route, { headers, params });
  }

  public post(route: string, body: any, params?: HttpParams): Observable<any> {
    return this.http.post(this.baseUrl + route, JSON.stringify(body), {
      params,
    });
  }
}
