import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CEData } from '../models/cedata';
import { CEApiService, CEHttpParams } from './api.service';

export interface ICEDataRequestParams extends CEHttpParams {
  year: number;
}

@Injectable({
  providedIn: 'root'
})
export class CEDataService {

  private ceDataSubject: Subject<CEData> = new Subject<CEData>();

  constructor(private api: CEApiService) { }

  public get ceData() {
    return this.ceDataSubject.asObservable();
  }

  public getCEComplianceData(year?: number): Observable<CEData> {
    return this.api.get('ceData', { year: year || new Date().getFullYear() })
      .pipe(
        tap(ceData => this.ceDataSubject.next(ceData.body))
      );
  }
}
