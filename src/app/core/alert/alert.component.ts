import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CEAlert, CEAlertButton } from '../../models/alert';
import { CEAlertService } from '../../services/alert.service';
import { NgIf, NgFor, NgClass } from '@angular/common';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, NgClass]
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
}
