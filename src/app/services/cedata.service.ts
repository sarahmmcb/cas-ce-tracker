import { inject, Injectable } from '@angular/core'
import { BehaviorSubject, Observable, Subject, throwError, of } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'

import { CEData, ComplianceStatus } from '../models/cedata'
import { ApiService, HttpParams } from './api.service'
import { ExperienceService } from './experience.service'
import { UserService } from './user.service'
import { AuthService } from '@app/auth/auth.service'

export interface ICEDataRequestParams extends HttpParams {
  year: number
}

@Injectable({
  providedIn: 'root',
})
export class CEDataService {
  private ceDataSubject: Subject<CEData> = new BehaviorSubject<CEData>({} as CEData)

  private api = inject(ApiService)
  private experienceService = inject(ExperienceService)
  private userService = inject(UserService)
  private auth = inject(AuthService)

  public get ceData() {
    return this.ceDataSubject.asObservable()
  }

  public getCEComplianceData(
    year: number,
    userId: number,
    nationalStandardId: number,
  ): Observable<CEData> {
    return this.api
      .get<CEData>(`/ceData/year/${year}/userId/${userId}/nationalStandardId/${nationalStandardId}`)
      .pipe(
        tap((ceData: CEData) => this.ceDataSubject.next(ceData)),
        catchError((err) => {
          return throwError(() => err)
        }),
      )
  }
}
