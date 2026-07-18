import { Component, inject, signal } from '@angular/core'
import { NgForm, FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { IonicModule } from '@ionic/angular'

import { AuthService } from './auth.service'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class AuthPage {
  public email: string
  public password: string
  public errMessage = signal('')
  public isSubmitted = signal(false)

  private auth = inject(AuthService)
  private router = inject(Router)

  public async onSubmit(form: NgForm): Promise<void> {
    if (!form.valid || this.isSubmitted()) {
      return
    }

    this.isSubmitted.set(true)

    return await this.auth
      .login(this.email, this.password)
      .then(() => {
        if (this.auth.userIsAuthenticated) {
          this.errMessage.set('')
          this.router.navigateByUrl('/overview')
        }
      })
      .catch((err) => {
        this.errMessage.set(this.auth.getErrorMessage(err))
        this.isSubmitted.set(false)
      })
      .finally(() => {
        this.isSubmitted.set(false)
        form.resetForm()
      })
  }
}
