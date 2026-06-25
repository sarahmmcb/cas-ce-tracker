import { Component, inject } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { environment } from '@env/environment'
import { IonicModule } from '@ionic/angular'

import { AuthService } from './auth/auth.service'
import { UserService } from './services/user.service'
import { AlertComponent } from './core/alert/alert.component'
import { ApiService } from './services/api.service'
import { LoadingComponent } from './core/loading/loading.component'

@Component({
  selector: 'app-root',
  imports: [IonicModule, AlertComponent, LoadingComponent, RouterModule],
  standalone: true,
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  get selectedYear() {
    return this.userService.selectedYear
  }

  get user() {
    return this.authService.user
  }

  private authService = inject(AuthService)
  private router = inject(Router)
  private apiService = inject(ApiService)
  private userService = inject(UserService)

  constructor() {
    this.initializeApp()
  }

  public onLogout(): void {
    this.authService.logout()
    this.router.navigateByUrl('/auth')
  }

  private initializeApp(): void {
    if (environment.production) {
      this.apiService.baseUrl = 'https://wordapi20211030215150.azurewebsites.net/api'
    } else if (environment.iis) {
      this.apiService.baseUrl = `https://localhost:7248/api`
    } else {
      this.apiService.baseUrl = 'https://localhost:7249/api'
    }
  }
}
