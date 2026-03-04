import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';

import { Alert } from '../../models/alert';
import { AlertService } from '../../services/alert.service';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    standalone: true,
    imports: [NgClass]
})
export class AlertComponent implements OnInit, OnDestroy {

  public alert = signal<Alert>(null);
  private alertSub: Subscription;

  constructor(private alertService: AlertService) {}

  public ngOnInit(): void {
   this.alertSub = this.alertService.alert.subscribe((alert: Alert) => {
      this.alert.set(alert);
    });
  }

  public ngOnDestroy(): void {
    this.alertSub.unsubscribe();
  }
}
