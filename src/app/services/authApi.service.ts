import { inject, Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { AUTH_API_URL } from '@app/core/tokens'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class AuthApiService extends ApiService {
  constructor() {
    super()
    this.baseUrl = inject(AUTH_API_URL)
  }
}
