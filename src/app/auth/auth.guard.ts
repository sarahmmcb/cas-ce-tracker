import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { map, catchError } from 'rxjs'
import { AuthService } from './auth.service'

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService)
  const router = inject(Router)

  if (!auth.userIsAuthenticated) {
    // attempt to authenticate with Refresh Token
    // Call refresh endpoint
    return auth.refreshAccessToken().pipe(
      map((user) => auth.userIsAuthenticated),
      catchError((err) => {
        return router.navigateByUrl('/auth')
      }),
    )
  }

  return auth.userIsAuthenticated
}
