import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, take, tap, map } from 'rxjs/operators';

import { ICategoryList } from '../models/category';
import { IUpdateExperience, IExperience, IUnit } from '../models/experience';
import { ILocation } from '../models/location';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  private experienceSub: BehaviorSubject<IExperience[]> = new BehaviorSubject<
    IExperience[]
  >([]);

  constructor(private api: ApiService) {}

  public get experiences() {
    return this.experienceSub.asObservable();
  }

  public getExperiences(
    year: number,
    userId: number,
    nationalStandardId: number
  ): Observable<IExperience[]> {
    return this.api
      .get(
        `/experiences/year/${year}/userId/${userId}/nationalStandardId/${nationalStandardId}`
      )
      .pipe(
        tap((experiences) => {
          this.experienceSub.next(experiences);
        })
      );
  }

  public fetchUnitInfo(nationalStandardId: number): Observable<IUnit[]> {
    return this.api.get(`/units/nationalStandardId/${nationalStandardId}`).pipe(
      map((res) => res.units),
      catchError((error) =>
        of({
          ...error,
          errorMessage: 'There was an error fetching unit info',
        })
      )
    );
  }

  public fetchCategoryLists(
    nationalStandardId: number,
    year: number
  ): Observable<ICategoryList[]> {
    return this.api
      .get(
        `/categoryLists/nationalStandardId/${nationalStandardId}/year/${year}`
      )
      .pipe(
        tap((res) => res.body),
        catchError((error) =>
          of({
            ...error,
            errorMessage: 'There was an error fetching experiences',
          })
        )
      );
  }

  public fetchLocations(): Observable<ILocation[]> {
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
