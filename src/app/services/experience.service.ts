import { inject, Injectable } from '@angular/core'
import { BehaviorSubject, Observable, throwError } from 'rxjs'
import { catchError, switchMap, take, tap, map } from 'rxjs/operators'

import { IUpdateExperience, Experience, ExperienceResponse } from '../models/experience'
import { ApiService } from './api.service'

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  private experienceSub: BehaviorSubject<Experience[]> = new BehaviorSubject<Experience[]>([])

  private apiService: ApiService = inject(ApiService)

  constructor() {}

  public get experiences() {
    return this.experienceSub.asObservable()
  }

  public getExperiences(
    year: number,
    userId: number,
    nationalStandardId: number,
  ): Observable<ExperienceResponse> {
    return this.apiService
      .get<ExperienceResponse>(
        `/experiences/year/${year}/userId/${userId}/nationalStandardId/${nationalStandardId}`,
      )
      .pipe(
        take(1),
        tap((expResponse) => {
          this.experienceSub.next(expResponse.experiences)
        }),
        catchError((err) => {
          return throwError(() => err)
        }),
      )
  }

  public createExperience(exp: IUpdateExperience): Observable<Experience[]> {
    let newExperience: Experience
    return this.apiService.put<Experience>('/experiences', exp).pipe(
      switchMap((newExp) => {
        newExperience = newExp
        return this.experiences
      }),
      take(1),
      tap((experiences) => {
        const expClone = [...experiences]
        this.experienceSub.next(expClone.concat(newExperience))
      }),
      catchError((err) => {
        return throwError(() => err)
      }),
    )
  }

  public updateExperience(exp: IUpdateExperience): Observable<Experience[]> {
    let updatedExperience: Experience
    return this.apiService.put<Experience>('/experiences', exp).pipe(
      switchMap((updatedExp) => {
        updatedExperience = updatedExp
        return this.experiences
      }),
      take(1),
      tap((experiences) => {
        const updatedExperiences = experiences.map((ex) => {
          if (ex.experienceId === updatedExperience.experienceId) return updatedExperience
          else return ex
        })

        this.experienceSub.next(updatedExperiences)
      }),
      catchError((err) => {
        return throwError(() => err)
      }),
    )
  }

  public deleteExperience(experienceId: number): Observable<Experience[]> {
    return this.apiService.delete('/experiences', experienceId).pipe(
      switchMap((res) => {
        if (res) {
          return this.experiences
        } else {
          return throwError(() => false)
        }
      }),
      take(1),
      tap((experiences) => {
        const expClone = [...experiences]
        const expIndex = experiences.findIndex((exp) => exp.experienceId === experienceId)
        expClone.splice(expIndex, 1)
        this.experienceSub.next(expClone)
      }),
      catchError((err) => {
        return throwError(() => false)
      }),
    )
  }
}
