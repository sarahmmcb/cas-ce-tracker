import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';

import { ICategoryList } from '../models/category';
import { IUpdateExperience, IExperience, IUnit } from '../models/experience';
import { ICELocation } from '../models/location';
import { CEApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CEExperienceService {
  private experienceSub: BehaviorSubject<IExperience[]> = new BehaviorSubject<
    IExperience[]
  >([]);

  constructor(private api: CEApiService) {}

  public get experiences() {
    return this.experienceSub.asObservable();
  }

  public getExperiences(year: number): Observable<IExperience[]> {
    return this.api.get('/experiences', { year }).pipe(
      tap((experiences) => {
        this.experienceSub.next(experiences);
      })
    );
  }

  // TODO: feed in route params
  public fetchUnitInfo(): Observable<IUnit[]> {
    return this.api.get('/units/1').pipe(
      tap((res) => res.body),
      catchError((error) =>
        of({
          ...error,
          errorMessage: 'There was an error fetching unit info',
        })
      )
    );
  }

  public fetchCategoryLists(): Observable<ICategoryList[]> {
    return this.api.get('/categoryLists').pipe(
      tap((res) => res.body),
      catchError((error) =>
        of({
          ...error,
          errorMessage: 'There was an error fetching experiences',
        })
      )
    );
  }

  public fetchLocations(): Observable<ICELocation[]> {
    return this.api.get('/locations').pipe(
      tap((res) => res.body),
      catchError((error) =>
        of({
          ...error,
          errorMessage: 'There was an error fetching locations',
        })
      )
    );
  }

  public addExperience(exp: IUpdateExperience = null): Observable<any> {
    let newExperience: IExperience;
    return this.api.post('/addExperience', exp).pipe(
      switchMap((newExp) => {
        newExperience = newExp;
        return this.experiences;
      }),
      take(1),
      tap((experiences) =>
        this.experienceSub.next(experiences.concat(newExperience))
      )
    );
  }
}
