import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { CEAlert, CEAlertButtonRole } from './alert';

@Injectable({
  providedIn: 'root'
})
export class CEAlertService {

  public alertSubject: Subject<CEAlert> = new Subject<CEAlert>();

  get alert() {
    return this.alertSubject.asObservable();
  }

  public showAlert(alert: CEAlert): void {
    this.updateButtonHandlers(alert);
    this.alertSubject.next(alert);
  }

  public clearAlert(): void {
    this.alertSubject.next(null);
  }

  // This function wraps the button handlers with extra functionality
  // to clear the alert message
  private updateButtonHandlers(alert: CEAlert): void {
    const ceAlertButtonRole = CEAlertButtonRole;
    for (const button of alert.buttons) {
      switch (button.role) {
        case ceAlertButtonRole.confirm:
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
