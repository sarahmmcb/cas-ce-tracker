import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
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

  constructor(private auth: AuthService,
              private router: Router) { }

  /**
   * On Init.
   */
  public ngOnInit(): void {
  }

  /**
   * On form submit.
   */
  public onSubmit(form: NgForm): void {
    if(!form.valid){
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    this.auth.login(email, password);
    form.reset();
    this.router.navigateByUrl('/overview');
  }

}
