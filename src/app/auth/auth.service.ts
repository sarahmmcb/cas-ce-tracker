import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tempUser: User = {
    userId: 1,
    firstName: 'Betty',
    lastName: 'Boop',
    email: 'stuff@stuff.com',
    roles: [
      {
        roleId: 1,
        nationalStandardId: 3,
        longName: 'Appointed Actuary',
        shortName: 'App. Actuary',
      },
    ],
    nationalStandard: {
      nationalStandardId: 3,
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
  };

  private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  private _userIsAuthenticated = true;

  constructor() {}

  /**
   * Retrieve the current user.
   */
  get user() {
    return this.userSubject.asObservable();
  }

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
