import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Alert, AlertButtonRole } from '../models/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alertSubject: Subject<Alert> = new Subject<Alert>();

  get alert() {
    return this.alertSubject.asObservable();
  }

  public showAlert(alert: Alert): void {
    this.updateButtonHandlers(alert);
    this.alertSubject.next(alert);
  }

  public clearAlert(): void {
    this.alertSubject.next(null);
  }

  // This function wraps the button handlers with extra functionality
  // to clear the alert message
  private updateButtonHandlers(alert: Alert): void {
    for (const button of alert.buttons) {
      switch (button.role) {
        case AlertButtonRole.confirm:
          button.handler = () => {
            this.clearAlert();
            button.action();
          };
        break;
        default: // cancel
          button.handler = () => {
            this.clearAlert();
            button.action();
          };
        break;
      }
    }
  }
}
