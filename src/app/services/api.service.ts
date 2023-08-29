import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CEHttpParams {
  [key: string]: string | string[] | number;
}

@Injectable({
  providedIn: 'root',
})
export class CEApiService {
  public baseUrl = 'api';

  constructor(private http: HttpClient) {}

  public get(route: string, params?: CEHttpParams): Observable<any> {
    return this.http.get(this.baseUrl + route, { params });
  }

  public post(
    route: string,
    body: any,
    params?: CEHttpParams
  ): Observable<any> {
    return this.http.post(this.baseUrl + route, JSON.stringify(body), {
      params,
    });
  }
}
