import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap, take, tap, map } from 'rxjs/operators';

import { ICategoryList } from '../models/category';
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
        }),
        catchError(err => {
          return throwError(() => err);
        })
      );
  }

  public createExperience(exp: IUpdateExperience): Observable<Experience[]> {
    let newExperience: Experience;
    return this.api.put('/experiences', exp).pipe(
      switchMap((newExp) => {  // should only return the id of the newly created experience
        newExperience = newExp;
        return this.experiences;
      }),
      take(1),
      tap((experiences) =>
        this.experienceSub.next(experiences.concat(newExperience))
      ),
      catchError(err => {
        return throwError(() => err)
      })
    );
  }

  
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

}
