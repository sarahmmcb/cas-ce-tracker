import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private auth: AuthService,
              private router: Router) {}

  public onLogout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/auth');
  }
}
