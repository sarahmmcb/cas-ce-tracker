import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '@env/environment';
import { IonicModule, ModalController } from '@ionic/angular';

import { AuthService } from './auth/auth.service';
import { User } from './models/user';
import { UserService } from './services/user.service';
import { AlertComponent } from './core/alert/alert.component';
import { ApiService } from './services/api.service';
import { LoadingComponent } from './core/loading/loading.component';

@Component({
    selector: 'app-root',
    imports: [IonicModule, AlertComponent, LoadingComponent, RouterModule],
    standalone: true,
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  
  public user: User;
  private authUserSub: Subscription;

  get selectedYear() {
    return this.userService.selectedYear;
  }

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
      this.api.baseUrl = 'https://wordapi20211030215150.azurewebsites.net/api';
    } else if (environment.iis){
        this.api.baseUrl = `https://localhost:7248/api`;
    } else {
      this.api.baseUrl = 'https://localhost:7249/api';
    }
  }
}