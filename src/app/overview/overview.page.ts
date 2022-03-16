import { Component, OnInit } from '@angular/core';
import { CEData } from '../models/cedata';

import { CEDataService } from '../services/cedata.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {

  /**
   * CEData object.
   */
  public ceData: CEData;

  constructor(private ceDataService: CEDataService) { }

  ngOnInit() {
    this.ceData = this.ceDataService.getCEData();
  }

}
