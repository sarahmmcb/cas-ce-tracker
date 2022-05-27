import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CEData } from 'src/app/models/cedata';

@Component({
  selector: 'app-compliance-graphic',
  templateUrl: './compliance-graphic.component.html',
  styleUrls: ['./compliance-graphic.component.scss'],
})
export class ComplianceGraphicComponent implements OnInit, OnChanges {

  @Input()
  public ceData: CEData;

  constructor() { }

  public ngOnInit(): void {}

  public ngOnChanges(changes: SimpleChanges): void {
      console.log(changes);
      this.ceData = changes.ceData.currentValue;
  }

}
