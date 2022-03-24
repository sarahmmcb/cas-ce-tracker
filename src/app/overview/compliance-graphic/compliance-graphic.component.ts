import { Component, Input, OnInit } from '@angular/core';
import { CEData } from 'src/app/models/cedata';

@Component({
  selector: 'app-compliance-graphic',
  templateUrl: './compliance-graphic.component.html',
  styleUrls: ['./compliance-graphic.component.scss'],
})
export class ComplianceGraphicComponent implements OnInit {

  @Input()
  public ceData: CEData;

  constructor() { }

  /**
   * On Init.
   */
  public ngOnInit(): void {}

}
