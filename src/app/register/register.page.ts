import { NgTemplateOutlet } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import { form, FormField, required, email } from '@angular/forms/signals'
import { RouterLink } from '@angular/router'
import { AccountStatus, CreateUserRequest } from '@app/models/user'
import { UserService } from '@app/services/user.service'
import { IonicModule } from '@ionic/angular'

export interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  password: string
  verifyPassword: string
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [FormField, NgTemplateOutlet, IonicModule, RouterLink],
})
export class RegisterPage {
  success = signal<boolean>(false)
  errMessage = signal<string>(null)
  private userService = inject(UserService)

  registerModel = signal<RegisterForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    verifyPassword: '',
  })

  registerForm = form(this.registerModel, (fieldPath) => {
    required(fieldPath.firstName, { message: 'First name is required' })
    required(fieldPath.lastName, { message: 'Last name is required' })
    required(fieldPath.email, { message: 'Email is required' })
    email(fieldPath.email, { message: 'Enter a valid email address' })
    required(fieldPath.password, { message: 'Password is required' })
    required(fieldPath.verifyPassword, { message: 'Password verification is required' })
  })

  onSubmit(event: Event) {
    event.preventDefault()

    const createUserRequest = {
      firstName: this.registerModel().firstName,
      lastName: this.registerModel().lastName,
      email: this.registerModel().email,
      username: this.registerModel().email,
      password: this.registerModel().password,
    }

    this.userService.register(createUserRequest).subscribe({
      next: () => {
        this.errMessage.set(null)
        this.success.set(true)
      },
      error: (err) => {
        this.success.set(false)
        this.errMessage.set(err)
      },
    })
  }
}
