import { inject, Injectable } from '@angular/core'

import { Credential, NationalStandard, Organization, CreateUserRequest } from '../models/user'
import { catchError, Observable, throwError } from 'rxjs'
import { AuthApiService } from './authApi.service'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _selectedYear: number
  private authApiService = inject(AuthApiService)

  get selectedYear(): number {
    if (!this._selectedYear) {
      return new Date().getFullYear()
    }

    return this._selectedYear
  }

  set selectedYear(year: number) {
    this._selectedYear = year
  }

  public register(createUserRequest: CreateUserRequest): Observable<any> {
    return this.authApiService
      .post('user/register', createUserRequest)
      .pipe(
        catchError((err) =>
          throwError(() => new Error('An error occurred, please try again later')),
        ),
      )
  }

  public fetchCredentials(): Credential[] {
    return [
      {
        credentialId: 1,
        organizationId: 1,
        longName: 'Fellow of the Casualty Actuarial Society',
        shortName: 'FCAS',
      },
      {
        credentialId: 2,
        organizationId: 1,
        longName: 'Associate of the Casualty Actuarial Society',
        shortName: 'ACAS',
      },
    ]
  }

  public fetchNationalStandards(): NationalStandard[] {
    return [
      {
        nationalStandardId: 1,
        owningOrganizationId: 2,
        longName: 'United States General Qualification Standard',
        shortName: 'USQS General',
      },
      {
        nationalStandardId: 2,
        owningOrganizationId: 2,
        longName: 'United States Specific Qualification Standard',
        shortName: 'USQS Specific',
      },
    ]
  }

  public fetchOrganizations(): Organization[] {
    return [
      {
        organizationId: 1,
        longName: 'Casualty Actuarial Society',
        shortName: 'CAS',
      },
      {
        organizationId: 2,
        longName: 'American Academy of Actuaries',
        shortName: 'AAA',
      },
    ]
  }
}
