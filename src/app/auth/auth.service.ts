import { createEnvironmentInjector, EnvironmentInjector, Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CEUser } from '../models/user';
import { environment } from 'src/environments/environment';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse } from '../models/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public accessToken: string;
  public errMessage: string;

  private apiService: ApiService;

  private tempUserSpecific: CEUser = {
    userId: 1,
    firstName: 'Betty',
    lastName: 'Boop',
    email: 'stuff@stuff.com',
    title: 'Ms.',
    nationalStandard: {
      nationalStandardId: 1,
      owningOrganizationId: 2,
      longName: 'United States General Qualification Standard',
      shortName: 'USQS General',
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
        longName: 'Fellow of the Casualty Actuarial Society',
      },
    ],
  };

  private userSubject: BehaviorSubject<CEUser> = new BehaviorSubject<CEUser>(
    null
  );

  private _userIsAuthenticated = false;

  constructor(
    private injector: EnvironmentInjector,
    private router: Router
  ) {
    // Create a separate instance of ApiService for Auth
    // so it can use its own baseUrl
    const childInjector = createEnvironmentInjector(
      [{
        provide: ApiService,
        useClass: ApiService,
        deps: [HttpClient]
      }],
      this.injector
    );

    this.apiService = childInjector.get(ApiService);
    
    if (environment.production) {

    }
    else {
      this.apiService.baseUrl = "https://localhost:44370/api";
    }
  }

  get user() {
    return this.userSubject.asObservable();
  }

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  public login(email: string, password: string): void {
    // login and get token
    this.apiService.post(
      '/session/login',
      {
        userName: email,
        password
      } as LoginRequest
    ).subscribe({
      next: (res: LoginResponse) => {
        this.accessToken = res.token;
        this._userIsAuthenticated = true;
        // TODO fetch user by user name
        this.userSubject.next(this.tempUserSpecific);
        this.router.navigateByUrl('/overview');
      },
      error: res => { // TODO: check status code of response to determine if error vs. incorrect username/pw
        this.errMessage = 'An error occurred, please try again later';
        this._userIsAuthenticated = false;
      }
    });
  }

  public logout(): void {
    this._userIsAuthenticated = false;
  }
}
