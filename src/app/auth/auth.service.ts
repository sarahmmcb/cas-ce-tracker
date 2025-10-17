import { createEnvironmentInjector, EnvironmentInjector, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, concatMap, map, Observable, tap, throwError } from 'rxjs';
import { User, UserData } from '../models/user';
import { environment } from 'src/environments/environment';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../models/auth';
import { ErrorStatus } from '../core/error/error';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public accessToken: string;
  public errMessage: string;

  private authApiService: ApiService;

  private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(
    {} as User
  );

  private _userIsAuthenticated = false;

  constructor(
    private injector: EnvironmentInjector,
    private apiService: ApiService
  ) {
    // Create a separate instance of ApiService for Auth so it can use its own baseUrl
    const childInjector = createEnvironmentInjector(
      [{
        provide: ApiService,
        useClass: ApiService,
        deps: [HttpClient]
      }],
      this.injector
    );

    this.authApiService = childInjector.get(ApiService);
    
    if (environment.production) {
      // TODO
    }
    else {
      if (environment.iis) {
        this.authApiService.baseUrl = "https://localhost:7142/api";
      }
      else {
        this.authApiService.baseUrl = "https://localhost:7143/api";
      }
    }
  }

  get user() {
    return this.userSubject.asObservable();
  }

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  public login(email: string, password: string): Observable<User> {
   let user = new User();
   return this.authApiService.post(
      '/session/login',
      {
        userName: email,
        password
      } as LoginRequest
    ).pipe(
      concatMap(res => {
        this.accessToken = res.token;
        this._userIsAuthenticated = true;
        return this.fetchUser(email);
      }),
      concatMap(userResp => {
        user = {...userResp} as User;
        return this.fetchUserData(user.id);
      }),
      map(userData => {
        user = {
          ...user,
          ...userData
        };
        this.userSubject.next(user);
        return user;
      }),
      catchError(err => throwError(() => err))
    );
  }

  public logout(): void {
    this.accessToken = '';
    this._userIsAuthenticated = false;
  }

  public getErrorMessage(err: any): string {
    if (err.status) {
      switch (err.status) {
        case ErrorStatus.NotFound:
          return "User not found. Please try again later.";
        case ErrorStatus.BadRequest:
          return "There was a problem with the request. Please reenter your credentials and try again.";
        case ErrorStatus.Unauthorized:
          return "Username or password incorrect.";
        default:
          return "An unexpected error occurred. Please try again later.";
      }
    } else {
      return "An unexpected error occurred. Please try again later."
    }
  }

  private fetchUser(username: string): Observable<User> {
    return this.authApiService.get('/user', {username});
  }

  private fetchUserData(userId: number): Observable<UserData> {
    return this.apiService.get(`/userData/userId/${userId}`);
  }
}
