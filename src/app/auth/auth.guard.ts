import { Injectable } from '@angular/core';
import { Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, map, catchError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private auth: AuthService,
              private router: Router) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | boolean {
    if (!this.auth.userIsAuthenticated) {
      // attempt to authenticate with Refresh Token
      // Call refresh endpoint
      return this.auth.refreshAccessToken()
      .pipe(
        map(user => this.auth.userIsAuthenticated),
        catchError(err => {
          return this.router.navigateByUrl('/auth')
        })
      );
    }
    
    return this.auth.userIsAuthenticated;
  }
}
