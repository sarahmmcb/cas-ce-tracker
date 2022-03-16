import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userIsAuthenticated = true;

  constructor() { }

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  /**
   * Log in method.
   */
  public login(email: string, password: string): void {
    this._userIsAuthenticated = true;
  }

  /**
   * Log out method.
   */
     public logout(): void {
      this._userIsAuthenticated = false;
    }
}
