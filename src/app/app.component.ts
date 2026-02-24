import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

import { AuthService } from './auth/auth.service';
import { User } from './models/user';
import { UserService } from './services/user.service';

import { IonicModule, ModalController } from '@ionic/angular';
import { AlertComponent } from './core/alert/alert.component';
import { ApiService } from './services/api.service';
import { AddExperienceComponent } from './overview/add-experience/add-experience.component';
import { CEDataService } from './services/cedata.service';
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
    private userService: UserService,
    private ceDataService: CEDataService,
    private modalCtrl: ModalController
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

    public async onAddCE(): Promise<void> {
      const modal = await this.modalCtrl.create({
        component: AddExperienceComponent,
      });
  
      await modal.present();

      return await modal.onDidDismiss().then(() => {
        this.ceDataService.getCEComplianceData(
          this.userService.selectedYear,
          this.userService.user.id,
          this.userService.user.nationalStandard.nationalStandardId
        ).subscribe({
            next: () => {},
            error: (error) => {
            }
          }
        );
      });
    }

  private initializeApp(): void {
    if (environment.production) {
      this.api.baseUrl = 'https://wordapi20211030215150.azurewebsites.net/api';
    } else {
      if (environment.iis) {
        this.api.baseUrl = `https://localhost:7248/api`;
      }
      else {
        this.api.baseUrl = 'https://localhost:7249/api';
      }
    }
  }
}
