import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CEAlert } from '../alert';
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

}
