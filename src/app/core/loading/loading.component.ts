import { Component, inject, InputSignal, OnInit, Signal } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    standalone: true
})
export class LoadingComponent implements OnInit {

  private loadingService = inject(LoadingService);
  public isLoading: Signal<boolean>;

  constructor() { }

  ngOnInit() {
    this.isLoading = this.loadingService.isLoading;
  }

}
