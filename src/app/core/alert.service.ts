import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { CEAlert } from './alert';

@Injectable({
  providedIn: 'root'
})
export class CEAlertService {

  /**
   * CEAlert subject for emitting a new alert.
   */
  public alertSubject: Subject<CEAlert> = new Subject<CEAlert>();

  constructor() { }

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
    this.alertSubject.next(alert);
  }

  /**
   * Clear the alert.
   */
  public clearAlert(): void {
    this.alertSubject.next(null);
  }
}
