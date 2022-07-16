import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ICECategoryList } from '../models/category';
import { IUpdateExperience, ICEExperience, ICEUnit } from '../models/experience';
import { ICELocation } from '../models/location';
import { CEApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CEExperienceService {

  private experienceSub: BehaviorSubject<ICEExperience[]> = new BehaviorSubject<ICEExperience[]>([]);

  constructor( private api: CEApiService ) { }

  public get experiences() {
    return this.experienceSub.asObservable();
  }

  public getExperiences(year: number): Observable<ICEExperience[]> {
    return this.api.get('/experiences', { year }).pipe(
      tap(experiences => {
        this.experienceSub.next(experiences);
      })
    );
  }

  public fetchUnitInfo(): Observable<ICEUnit[]> {
    return this.api.get('/units').pipe(
      tap(res => res.body),
      catchError(error => of({
        ...error,
        errorMessage: 'There was an error fetching unit info'
      }))
    );
  }

  public fetchCategoryLists(): Observable<ICECategoryList[]> {
    return this.api.get('/categoryLists').pipe(
      tap(res => res.body),
      catchError(error => of({
        ...error,
        errorMessage: 'There was an error fetching experiences'
      }))
    );
  }

  public fetchLocations(): Observable<ICELocation[]> {
    return this.api.get('/locations').pipe(
      tap(res => res.body),
      catchError(error => of({
        ...error,
        errorMessage: 'There was an error fetching locations'
      }))
    );
  }

public addExperience(exp: IUpdateExperience = null): Observable<any> {
  // make API call to update database, return updated experience list
  // and updated ceData object
  return this.api.post('/addExperience', exp).pipe(
    tap(res => console.log(res.body))
  );
}

}
