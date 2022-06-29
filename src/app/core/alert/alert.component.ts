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

  public alert: CEAlert;

  public alertSub: Subscription;

  constructor(private alertService: CEAlertService) {}

  public ngOnInit(): void {
   this.alertSub = this.alertService.alert.subscribe((alert: CEAlert) => {
      this.alert = alert;
    });
  }

  public ngOnDestroy(): void {
    this.alertSub.unsubscribe();
  }

  // public onButtonClick(button: CEAlertButton): void {
  //   button.handler();
  // }
}
