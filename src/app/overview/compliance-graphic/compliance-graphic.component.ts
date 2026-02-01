import { Component, ElementRef, EventEmitter, input, Input, OnDestroy, OnInit, Output, signal, viewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CEData } from 'src/app/models/cedata';
import { ProgressIndicatorComponent } from './progress-indicator/progress-indicator.component';


@Component({
    selector: 'app-compliance-graphic',
    templateUrl: './compliance-graphic.component.html',
    styleUrls: ['./compliance-graphic.component.scss'],
    standalone: true,
    imports: [IonicModule, ProgressIndicatorComponent]
})
export class ComplianceGraphicComponent implements OnInit, OnDestroy {

  //public year = input<number>();
  public ceData = input<CEData>();
  
  // @Output()
  // public yearChanged = new EventEmitter();
  
  // public minYear = 2022; // TODO: put somewhere more central?

  // public allYears: number[];

 // private extra = viewChild<ElementRef<any>>('extra');


  constructor() {}

  public ngOnInit(): void {
    // this.allYears = Array.from(
    //   { length: this.year() - this.minYear + 1 },
    //   (_, i) => i + this.minYear
    // );

    // this.extra()?.nativeElement.addEventListener('animationend', (ev) => {
    //   this.extra()?.nativeElement.classList.remove('extra-start');
    //   this.extra()?.nativeElement.classList.add('extra-end');
    // });
  }

  public ngOnDestroy(): void {
    // this.extra()?.nativeElement.removeEventListener('animationend');
  }

  // public emitYearChanged(event: any) {
  //   this.yearChanged.emit(event.detail.value);
  // }
}
