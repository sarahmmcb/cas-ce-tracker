import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';

import { AuthService } from './auth.service';

import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
    standalone: true,
    imports: [IonicModule, FormsModule]
})
export class AuthPage implements OnInit {

  public email: string;
  public password: string;
  public errMessage: string;

  constructor(private auth: AuthService,
              private router: Router) {}

  public ngOnInit(): void {}

  public onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    this.auth.login(email, password)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/overview');
        },
        error: err => {
          this.errMessage = this.auth.getErrorMessage(err);
        }
      });
  }
}
