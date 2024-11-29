import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

import { AuthService } from './auth/auth.service';
import { CEUser } from './models/user';
import { ApiService } from './services/api.service';
import { UserService } from './services/user.service';
import { NgIf } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AlertComponent } from './core/alert/alert.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptorService } from './app.interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule, NgIf, AlertComponent],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptorService }]
})
export class AppComponent implements OnInit, OnDestroy {
  public user: CEUser;

  private authUserSub: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private api: ApiService,
    private userService: UserService
  ) {
    this.initializeApp();
  }

  public ngOnInit(): void {
    this.authUserSub = this.auth.user.subscribe(
      (user) => (this.userService.user = user)
    );
  }

  public ngOnDestroy(): void {
    if (this.authUserSub) {
      this.authUserSub.unsubscribe();
    }
  }

  public onLogout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/auth');
  }

  private initializeApp(): void {
    if (environment.production) {
      this.api.baseUrl = `https://wordapi20211030215150.azurewebsites.net/${this.api.baseUrl}`;
    } else {
      //this.api.baseUrl = `http://localhost:54443/${this.api.baseUrl}`;
      this.api.baseUrl = `https://localhost:7248/${this.api.baseUrl}`;
    }
  }
}
