import { HttpClient, HttpResponse, HttpStatusCode } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { API_URL } from '@app/core/tokens'
import { catchError, map, Observable, throwError } from 'rxjs'

export interface HttpParams {
  [key: string]: string | string[] | number
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected baseUrl = inject(API_URL)

  protected http = inject(HttpClient)

  public get<T>(route: string, params?: HttpParams): Observable<T> {
    return this.http
      .get(this.baseUrl + route, {
        params,
        observe: 'response',
        withCredentials: true,
      })
      .pipe(
        map((res: HttpResponse<T>) => {
          if (res.status >= 400) {
            // TODO: figure out a response format that guarantees a message property
            // so we can display it here
            throw new Error('An unexpected error occurred')
          }

          return res.body
        }),
        catchError((err) => {
          return throwError(() => err)
        }),
      )
  }

  public post<T>(route: string, body: any, params?: HttpParams): Observable<T> {
    return this.http
      .post(this.baseUrl + route, JSON.stringify(body), {
        params,
        observe: 'response',
        withCredentials: true,
      })
      .pipe(map((res: HttpResponse<T>) => res.body))
  }

  public put<T>(route: string, body: any, params?: HttpParams): Observable<T> {
    return this.http
      .put(this.baseUrl + route, JSON.stringify(body), {
        params,
        observe: 'response',
        withCredentials: true,
      })
      .pipe(map((res: HttpResponse<T>) => res.body))
  }

  public delete(route: string, resourceId: number): Observable<boolean> {
    return this.http
      .delete(`${this.baseUrl}${route}/${resourceId}`, {
        observe: 'response',
        withCredentials: true,
      })
      .pipe(map((res) => res.status == HttpStatusCode.Ok))
  }
}
