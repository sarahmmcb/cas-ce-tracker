import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CEData } from 'src/app/models/cedata';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-compliance-graphic',
    templateUrl: './compliance-graphic.component.html',
    styleUrls: ['./compliance-graphic.component.scss'],
    standalone: true,
    imports: [IonicModule, NgFor]
})
export class ComplianceGraphicComponent implements OnInit {
  @Input()
  public year: number;

  @Input()
  public ceData: CEData;

  @Input()
  public errorMessage = 'error';

  @Output()
  public yearChanged = new EventEmitter();

  public minYear = 2022; // TODO: put somewhere more central?

  public allYears: number[];

  constructor() {}

  public ngOnInit(): void {
    this.allYears = Array.from(
      { length: this.year - this.minYear + 1 },
      (_, i) => i + this.minYear
    );
  }

  public emitYearChanged(event: any) {
    this.yearChanged.emit(event.detail.value);
  }
}
