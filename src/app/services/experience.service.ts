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
  private _categoryLists: ICategoryList[];
  private _locations: Location[];

 //#region Experiences

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

  public createExperience(exp: IUpdateExperience): Observable<Experience[]> {
    let newExperience: Experience;
    return this.api.put('/experiences', exp).pipe(
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

  //#endregion

  public updateExperience(exp: IUpdateExperience): Observable<Experience[]> {
    let updatedExperience: Experience;
    return this.api.put('/experiences', exp).pipe(
      switchMap((updatedExp) => {
        updatedExperience = updatedExp;
        return this.experiences;
      }),
      take(1),
      tap((experiences) => {
          const expIndex = experiences.findIndex(exp => exp.experienceId === updatedExperience.experienceId);
          experiences.splice(expIndex, 1, updatedExperience);
          this.experienceSub.next(experiences);
        }
      )
    );
  }

 //#region Units

  public getUnits(nationalStandardId: number): Observable<IUnit[]> {
    return new Observable(observer => {
      if (this._units) {
        observer.next(this._units);
        observer.complete();
      }

      this.fetchUnitInfo(nationalStandardId)
      .subscribe({
        next: (res) => {
            this._units = res;
            observer.next(this._units);
            observer.complete();
          },
        error: err => {
          observer.error(err)
        }
      });
    });
  }

  
  private fetchUnitInfo(nationalStandardId: number): Observable<IUnit[]> {
    return this.api.get(`/units/nationalStandardId/${nationalStandardId}`).pipe(
      map(res => res.units),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
  
  //#endregion

 //#region CategoryLists

  public getCategoryLists(
    nationalStandardId: number,
    year: number
  ): Observable<ICategoryList[]> {
    return new Observable(observer => {
      if (this._categoryLists) {
        observer.next(this._categoryLists);
        observer.complete();
      }

      this.fetchCategoryLists(
        nationalStandardId,
        year).subscribe({
          next: (res) => {
              this._categoryLists = res;
              observer.next(this._categoryLists);
              observer.complete();
            },
          error: err => {
            observer.error(err)
          }
        });
    });
  }

  private fetchCategoryLists(
    nationalStandardId: number,
    year: number
  ): Observable<ICategoryList[]> {
    return this.api
      .get(
        `/categoryLists/nationalStandardId/${nationalStandardId}/year/${year}`
      ).pipe(
        map(res => res.categoryLists),
        catchError(err => throwError(() => err))
      );
  }

 //#endregion

 //#region Locations

  public getLocations(): Observable<Location[]> {
    return new Observable(observer => {
      if (this._locations) {
        observer.next(this._locations);
        observer.complete();
      }

      this.fetchLocations().subscribe({
        next: (res) => {
            this._locations = res;
            observer.next(this._locations);
            observer.complete();
          },
        error: err => {
          observer.error(err)
        }
      });
    });
  }

  private fetchLocations(): Observable<Location[]> {
    return this.api.get('/locations').pipe(
      map(res => res.locations),
      catchError(err => throwError(() => err))
    );
  }

 //#endregion

}
