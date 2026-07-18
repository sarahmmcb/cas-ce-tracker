import { Injectable, inject, signal } from '@angular/core'
import { catchError, concatMap, map, Observable, firstValueFrom, throwError } from 'rxjs'
import { User, UserData } from '@app/models/user'
import { ApiService } from '@app/services/api.service'
import { LoginRequest, LoginResponse } from '@app/models/auth'
import { ErrorStatus } from '@app/core/error/error'
import { CookieService } from 'ngx-cookie-service'
import { AuthApiService } from '@app/services/authApi.service'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public accessToken: string
  public errMessage: string
  private _userIsAuthenticated = false
  private _user = signal(null)

  private authApiService = inject(AuthApiService)
  private apiService = inject(ApiService)
  private cookieService = inject(CookieService)

  get user() {
    return this._user()
  }

  get userIsAuthenticated() {
    return this._userIsAuthenticated
  }

  public login(email: string, password: string): Promise<void> {
    let user = new User()
    return firstValueFrom(
      this.authApiService
        .post<LoginResponse>('/session/login', {
          userName: email,
          password,
        } as LoginRequest)
        .pipe(
          concatMap((res) => {
            this.accessToken = res.token
            this._userIsAuthenticated = true
            return this.fetchUser(email)
          }),
          concatMap((userResp) => {
            user = { ...userResp } as User
            return this.fetchUserData(user.id)
          }),
          map((userData) => {
            user = {
              ...user,
              ...userData,
            }
            this._user.set(user)
          }),
          catchError((err) => {
            return throwError(() => err)
          }),
        ),
    )
  }

  public logout(): void {
    this.accessToken = ''
    this.cookieService.delete('userName')
    this._userIsAuthenticated = false
  }

  public getErrorMessage(err: any): string {
    if (err.status) {
      switch (err.status) {
        case ErrorStatus.NotFound:
          return 'User not found. Please try again later.'
        case ErrorStatus.BadRequest:
          return 'There was a problem with the request. Please reenter your credentials and try again.'
        case ErrorStatus.Unauthorized:
          return 'Username or password incorrect.'
        default:
          return 'An unexpected error occurred. Please try again later.'
      }
    } else {
      return 'An unexpected error occurred. Please try again later.'
    }
  }

  public refreshAccessToken(): Observable<void> {
    let user = new User()
    const userName = this.cookieService.get('userName')

    return this.authApiService.get<LoginResponse>('/session/refresh').pipe(
      concatMap((res) => {
        this.accessToken = res.token
        this._userIsAuthenticated = true
        return this.fetchUser(userName)
      }),
      concatMap((userResp) => {
        user = { ...userResp } as User
        return this.fetchUserData(user.id)
      }),
      map((userData) => {
        user = {
          ...user,
          ...userData,
        }
        this._user.set(user)
      }),
      catchError((err) => {
        return throwError(() => err)
      }),
    )
  }

  private fetchUser(username: string): Observable<User> {
    return this.authApiService.get('/user', { username })
  }

  private fetchUserData(userId: number): Observable<UserData> {
    return this.apiService.get(`/userData/userId/${userId}`)
  }
}
