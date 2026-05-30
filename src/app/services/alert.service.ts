import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Alert, AlertButtonRole } from '../models/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alertSubject: BehaviorSubject<Alert[]> = new BehaviorSubject<Alert[]>([]);

  get alert() {
    return this.alertSubject.asObservable();
  }

  public showAlert(alert: Alert): void {
    this.updateButtonHandlers(alert);
    const curr = [...this.alertSubject.value];
    curr.push(alert);
    this.alertSubject.next(curr);
  }

  public clearAlert(alert: Alert): void {
    const curr = this.alertSubject.value;
    const idx = curr.findIndex((al: Alert) => al === alert);
    curr.splice(idx, 1);
    
    this.alertSubject.next(curr);
  }

  // This function wraps the button handlers with extra functionality
  // to clear the alert message
  private updateButtonHandlers(alert: Alert): void {
    for (const button of alert.buttons) {
      switch (button.role) {
        case AlertButtonRole.confirm:
          button.handler = async () => {
            this.clearAlert(alert);
            await button.action();
          };
        break;
        default: // cancel
          button.handler = async () => {
            this.clearAlert(alert);
            await button.action();
          };
        break;
      }
    }
  }
}
