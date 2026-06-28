import { InjectionToken } from '@angular/core'
import { environment } from '@env/environment'

export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => {
    if (environment.production) {
      return 'https://wordapi20211030215150.azurewebsites.net/api'
    } else if (environment.iis) {
      return `https://localhost:7248/api`
    } else {
      return 'https://localhost:7249/api'
    }
  },
})

export const AUTH_API_URL = new InjectionToken('AUTH_API_URL', {
  factory: () => {
    if (environment.production) {
    } else if (environment.iis) {
      return 'https://localhost:7142/api'
    } else if (environment.docker) {
      return 'https://localhost:44370/api'
    } else {
      return 'https://localhost:7143/api'
    }
  },
})
