import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';

import { IUpdateExperience, Experience } from '../models/experience';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  
  private experienceSub: BehaviorSubject<Experience[]> = new BehaviorSubject<
    Experience[]
  >([]);

  private apiService: ApiService = inject(ApiService);

  constructor() {}

  public get experiences() {
    return this.experienceSub.asObservable();
  }

  public getExperiences(
    year: number,
    userId: number,
    nationalStandardId: number
  ): Observable<Experience[]> {
    return this.apiService
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
    return this.apiService.put('/experiences', exp).pipe(
      switchMap((newExp) => {
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
    return this.apiService.put('/experiences', exp).pipe(
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
      ),
      catchError(err => {
        return throwError(() => err)
      })
  );
}

}
