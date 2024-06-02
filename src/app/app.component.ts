import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

import { AuthService } from './auth/auth.service';
import { CEUser } from './models/user';
import { ApiService } from './services/api.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
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
      this.api.baseUrl = `https://localhost:7248/${this.api.baseUrl}`;
      //this.api.baseUrl = `https://wordapi20211030215150-test.azurewebsites.net/${this.api.baseUrl}`;
      //this.api.baseUrl = `https://wordapi20211030215150.azurewebsites.net/${this.api.baseUrl}`;
    }
  }
}
