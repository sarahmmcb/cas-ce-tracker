import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Alert, AlertButton } from '../../models/alert';
import { AlertService } from '../../services/alert.service';
import { NgIf, NgFor, NgClass } from '@angular/common';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, NgClass]
})
export class AlertComponent implements OnInit, OnDestroy {

  public alert: Alert;

  public alertSub: Subscription;

  constructor(private alertService: AlertService) {}

  public ngOnInit(): void {
   this.alertSub = this.alertService.alert.subscribe((alert: Alert) => {
      this.alert = alert;
    });
  }

  public ngOnDestroy(): void {
    this.alertSub.unsubscribe();
  }
}
