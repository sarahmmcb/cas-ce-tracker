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

  private auth = inject(AuthService)
  private router = inject(Router)

  public async onSubmit(form: NgForm): Promise<void> {
    if (!form.valid) {
      return
    }

    const email = form.value.email
    const password = form.value.password

    // this.auth.login(email, password).subscribe({
    //   next: () => {
    //     this.router.navigateByUrl('/overview')
    //   },
    //   error: (err) => {
    //     this.errMessage.set(this.auth.getErrorMessage(err))
    //   },
    // })

    await this.auth
      .login(email, password)
      .catch((err) => this.errMessage.set(this.auth.getErrorMessage(err)))

    this.router.navigateByUrl('/overview')
  }
}
