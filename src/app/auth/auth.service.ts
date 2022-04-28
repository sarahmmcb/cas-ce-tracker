import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CEUser } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tempUser: CEUser = {
    userId: 1,
    firstName: 'Betty',
    lastName: 'Boop',
    email: 'stuff@stuff.com',
    title: 'Ms.',
    nationalStandard: {
      nationalStandardId: 2,
      owningOrganizationId: 2,
      longName: 'United States Specific Qualification Standard',
      shortName: 'USQS Specific',
    },
    organizations: [
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
    ],
    credentials: [
      {
        credentialId: 1,
        organizationId: 1,
        shortName: 'FCAS',
        longName: 'Fellow of the Casualty Actuarial Society'
      }
    ]
  };

  private userSubject: BehaviorSubject<CEUser> = new BehaviorSubject<CEUser>(null);

  private _userIsAuthenticated = false;

  constructor() {}

  /**
   * Retrieve the current user.
   */
  get user() {
    return this.userSubject.asObservable();
  }

  /**
   * Return user is authenticated boolean.
   */
  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  /**
   * Log in method.
   */
  public login(email: string, password: string): void {
    this._userIsAuthenticated = true;
    this.userSubject.next(this.tempUser);
  }

  /**
   * Log out method.
   */
  public logout(): void {
    this._userIsAuthenticated = false;
  }
}
