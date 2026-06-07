import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { IonicModule, ModalController } from '@ionic/angular';
import { AuthService } from '@app/auth/auth.service';
import { AddExperienceComponent } from '@app/overview/add-experience/add-experience.component';
import { UserService } from '@app/services/user.service';
import { CEDataService } from '@app/services/cedata.service';

@Component({
    selector: 'app-footer',
    imports: [IonicModule, RouterModule],
    standalone: true,
    templateUrl: 'footer.component.html',
    styleUrls: ['footer.component.scss']
})
export class FooterComponent {

  get selectedYear() {
      return this.userService.selectedYear;
  }

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController,
    private ceDataService: CEDataService,
  ) {}

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
        ).subscribe();
    });
  }
}
  