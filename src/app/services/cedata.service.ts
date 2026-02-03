import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { CEData, ComplianceStatus } from '../models/cedata';
import { ApiService, HttpParams } from './api.service';

export interface ICEDataRequestParams extends HttpParams {
  year: number;
}

@Injectable({
  providedIn: 'root',
})
export class CEDataService {
  private ceDataSubject: Subject<CEData> = new BehaviorSubject<CEData>({} as CEData);

  private sampleCEData = {
    nationalStandardId: 1,
    title: 'USQS General',
    unitLongName:'Credits',
    unitShortName: 'Cr',
    complianceStatus: ComplianceStatus.nonCompliant,
    categoryData: [
        {
          categoryId: 2,
          displayName: 'Professionalism',
          minimum: 3,
          maximum: 0,
          amountCompleted: 3,
        },
        {
          categoryId: 3,
          displayName: 'Bias Topics',
          minimum: 1,
          maximum: 0,
          amountCompleted: 0,
        },
        {
          categoryId: 4,
          displayName: 'General Business',
          minimum: 0,
          maximum: 3,
          amountCompleted: 5,
        },
        {
          categoryId: 5,
          displayName: 'Other Relevant',
          minimum: 0,
          maximum: 0,
          amountCompleted: 10,
        },
        {
          categoryId: 6,
          displayName: 'Organized',
          minimum: 6,
          maximum: 0,
          amountCompleted: 2,
        },
        {
          categoryId: 1,
          displayName: 'Total CE',
          minimum: 30,
          maximum: 0,
          amountCompleted: 16,
        }
    ]
  } as CEData;

  constructor(private api: ApiService) {}

  public get ceData() {
    return this.ceDataSubject.asObservable();
  }

  public getCEComplianceData(year: number, userId: number, nationalStandardId: number): Observable<CEData> {
    return this.api
      .get(`/ceData/year/${year}/userId/${userId}/nationalStandardId/${nationalStandardId}`)
      .pipe(
        tap((ceData) => this.ceDataSubject.next(ceData)),
        catchError((err) => {
          console.log('Error fetching CeData'); // TODO: remove this after adding more accurate error messaging
          return throwError(() => err);
        })
      );
  }
}
