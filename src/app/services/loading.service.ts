import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  
  private _isLoading = signal(false);

  public readonly isLoading = this._isLoading.asReadonly();

  public showLoadingControl(): void {
    this._isLoading.set(true);
  }

  public dismissLoadingControl(): void {
    this._isLoading.set(false);
  }

}
