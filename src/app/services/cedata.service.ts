import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { CEData } from '../models/cedata';
import { ApiService, HttpParams } from './api.service';

export interface ICEDataRequestParams extends HttpParams {
  year: number;
}

@Injectable({
  providedIn: 'root',
})
export class CEDataService {
  private ceDataSubject: Subject<CEData> = new BehaviorSubject<CEData>(new CEData());

  private sampleCEData = {
    categoryGroups: [
      {
        title: 'General',
        categories: [
          {
            displayName: 'Professionalism',
            minimum: 3,
            maximum: -1,
            amountCompleted: 3,
            percentCompleted: 100   
          },
          {
            displayName: 'Bias Topics',
            minimum: 1,
            maximum: -1,
            amountCompleted: 0,
            percentCompleted: 0   
          },
          {
            displayName: 'General Business',
            minimum: 0,
            maximum: 3,
            amountCompleted: 5,
            percentCompleted: 166.67   
          },
          {
            displayName: 'Organized',
            minimum: 6,
            maximum: -1,
            amountCompleted: 2,
            percentCompleted: 33.33   
          },
          {
            displayName: 'Total CE',
            minimum: 30,
            maximum: -1,
            amountCompleted: 6,
            percentCompleted: 20  
          }
        ]
      }
    ]
  } as CEData;

  constructor(private api: ApiService) {}

  public get ceData() {
    return this.ceDataSubject.asObservable();
  }

  public getCEComplianceData(year?: number): Observable<CEData> {
    return this.api
      .get(`/ceData/${year || new Date().getFullYear()}`)
      .pipe(
        tap((ceData) => this.ceDataSubject.next(this.sampleCEData)),
        catchError((err) => {
          console.log('error on get'); // TODO: remove this after adding more accurate error messaging
          return throwError(() => err);
        })
      );
  }
}
