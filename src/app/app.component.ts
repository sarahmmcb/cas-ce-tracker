import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { environment } from '@env/environment';
import { IonApp, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonItem, IonList, IonMenu, IonMenuButton, IonMenuToggle, IonRouterLink, IonRouterOutlet, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatbubbles, create, informationCircle, home, exit, addCircle, search, openOutline } from 'ionicons/icons'

import { AuthService } from './auth/auth.service';
import { User } from './models/user';
import { UserService } from './services/user.service';
import { AlertComponent } from './core/alert/alert.component';
import { ApiService } from './services/api.service';
import { AddExperienceComponent } from './overview/add-experience/add-experience.component';
import { CEDataService } from './services/cedata.service';
import { LoadingComponent } from './core/loading/loading.component';

@Component({
    selector: 'app-root',
    imports: [
      IonApp,
      IonRouterLink,
      IonContent,
      IonMenu,
      IonMenuToggle,
      IonMenuButton,
      IonHeader,
      IonTitle,
      IonList,
      IonIcon,
      IonItem,
      IonRouterOutlet,
      IonFooter,
      IonToolbar,
      IonButton,
      IonButtons,
      AlertComponent, LoadingComponent, RouterModule],
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
    addIcons({ 
      chatbubbles,
      create,
      informationCircle,
      home,
      exit,
      addCircle,
      search,
      openOutline
    });
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
    } else if (environment.iis){
        this.api.baseUrl = `https://localhost:7248/api`;
    } else {
      this.api.baseUrl = 'https://localhost:7249/api';
    }
  }
}
