import { Component, inject } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { IonicModule } from '@ionic/angular'

import { AuthService } from './auth/auth.service'
import { UserService } from './services/user.service'
import { AlertComponent } from './core/alert/alert.component'
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
  private userService = inject(UserService)

  public onLogout(): void {
    this.authService.logout()
    this.router.navigateByUrl('/auth')
  }
}
