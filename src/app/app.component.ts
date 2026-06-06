import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '@env/environment';
import { Subscription } from 'rxjs';

import { IonicModule } from '@ionic/angular';
import { AlertComponent } from './core/alert/alert.component';
import { ApiService } from './services/api.service';
import { LoadingComponent } from './core/loading/loading.component';
import { AuthService } from './auth/auth.service';
import { UserService } from './services/user.service';

@Component({
    selector: 'app-root',
    imports: [IonicModule, AlertComponent, LoadingComponent, RouterModule],
    standalone: true,
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
  
  private authUserSub: Subscription;

  constructor(
    private api: ApiService,
    private auth: AuthService,
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
