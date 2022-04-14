import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { CEAlert, CEAlertButtonRole } from './alert';

@Injectable({
  providedIn: 'root'
})
export class CEAlertService {

  /**
   * CEAlert subject for emitting a new alert.
   */
  public alertSubject: Subject<CEAlert> = new Subject<CEAlert>();

  constructor( private router: Router ) { }

  /**
   * Return alert observable.
   */
  get alert() {
    return this.alertSubject.asObservable();
  }

  /**
   * Issue an alert.
   */
  public showAlert(alert: CEAlert): void {

    this.updateButtonHandlers(alert);
    this.alertSubject.next(alert);
  }

  /**
   * Clear the alert.
   */
  public clearAlert(): void {
    this.alertSubject.next(null);
  }

  /**
   * Set the alert button handlers.
   *
   * @param alert
   */
  private updateButtonHandlers(alert: CEAlert): void {
    const ceAlertButtonRole = CEAlertButtonRole;
    for (const button of alert.buttons) {
      switch (button.role) {
        case ceAlertButtonRole.confirm:
          button.handler = () => {
            this.alertSubject.next();
            button.action();
          };
        break;
        default: // cancel
          button.handler = () => {
            this.alertSubject.next();
            button.action();
          };
        break;
      }
    }
  }
}
