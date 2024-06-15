import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

import { AuthService } from './auth.service';
import { NgIf } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
    standalone: true,
    imports: [IonicModule, FormsModule, NgIf]
})
export class AuthPage implements OnInit {
  /**
   * User email.
   */
  public email: string;

  /**
   * User password.
   */
  public password: string;

  constructor(private auth: AuthService, private router: Router) {}

  /**
   * On Init.
   */
  public ngOnInit(): void {}

  /**
   * On form submit.
   */
  public onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    this.auth.login(email, password);
    if (this.auth.userIsAuthenticated) {
      this.router.navigateByUrl('/overview');
    }
    form.reset();
  }
}
