import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, take, tap, map } from 'rxjs/operators';

import { ICategory, ICategoryList } from '../models/category';
import { IUpdateExperience, Experience, IUnit } from '../models/experience';
import { Location } from '../models/location';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private experienceSub: BehaviorSubject<Experience[]> = new BehaviorSubject<
    Experience[]
  >([]);

  constructor(private api: ApiService) {}

  public get experiences() {
    return this.experienceSub.asObservable();
  }

  private _units: IUnit[];

  public getExperiences(
    year: number,
    userId: number,
    nationalStandardId: number
  ): Observable<Experience[]> {
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

  public getUnits(nationalStandardId: number): Observable<IUnit[]> {
    return new Observable(observer => {
      if (this._units) {
        observer.next(this._units);
        return observer.complete();
      }

      this.fetchUnitInfo(nationalStandardId).subscribe(units => {
        this._units = units;
        observer.next(this._units);
        observer.complete();
      });
    });
  }

  private fetchUnitInfo(nationalStandardId: number): Observable<IUnit[]> {
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
        map((res) => res.categoryLists),
        catchError((error) =>
          of({
            ...error,
            errorMessage: 'There was an error fetching experiences',
          })
        )
      );
  }

  public fetchLocations(): Observable<Location[]> {
    return this.api.get('/locations').pipe(
      map((res) => res.locations),
      catchError((error) =>
        of({
          ...error,
          errorMessage: 'There was an error fetching locations',
        })
      )
    );
  }

  public createExperience(exp: IUpdateExperience = null): Observable<Experience[]> {
    let newExperience: Experience;
    return this.api.post('/experiences', exp).pipe(
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
