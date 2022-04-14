import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CEAlert, CEAlertButton } from '../alert';
import { CEAlertService } from '../alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit, OnDestroy {

  /**
   * Alert object to display.
   */
  public alert: CEAlert;
  // public alert: CEAlert = {
  //   title: 'Confirm',
  //   content: 'Are you you want to quit? Your changes will not be saved.',
  //   type: 'confirm',
  //   buttons: [{
  //     text: 'OK',
  //     role: 'confirm',
  //     id: 'confirmButton',
  //     handler: () => {}
  //   }, {
  //     text: 'Cancel',
  //     role: 'cancel',
  //     id: 'cancelButton',
  //     handler: () => {}
  //   }]
  // };

  /**
   * Alert subscription.
   */
  public alertSub: Subscription;

  constructor(private alertService: CEAlertService) {}

  /**
   * On init.
   */
  public ngOnInit(): void {
   this.alertSub = this.alertService.alert.subscribe((alert: CEAlert) => {
      this.alert = alert;
    });
  }

  /**
   * On destroy.
   */
  public ngOnDestroy(): void {
    this.alertSub.unsubscribe();
  }

  /**
   * Logic to execute when an alert's button
   * is clicked.
   */
  public onButtonClick(button: CEAlertButton): void {
    button.handler();
  }
}
