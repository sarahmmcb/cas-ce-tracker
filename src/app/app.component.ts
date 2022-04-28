import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from './auth/auth.service';
import { CEUser } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  public user: CEUser;

  private authUserSub: Subscription;

  constructor(private auth: AuthService,
              private router: Router) {}

  /**
   * On Init.
   */
  public ngOnInit(): void {
    this.authUserSub = this.auth.user.subscribe(user => this.user = user);
  }

  /**
   * On Destroy.
   */
  public ngOnDestroy(): void {
    if (this.authUserSub) {
      this.authUserSub.unsubscribe();
    }
  }

  /**
   * Logout function.
   */
  public onLogout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/auth');
  }
}
