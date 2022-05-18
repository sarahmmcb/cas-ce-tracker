import { Injectable } from '@angular/core';

import { CECategory } from '../models/category';
import { CEData, ComplianceStatus } from '../models/cedata';
import { CEApiService, CEHttpParams } from './api.service';

export interface ICEDataRequestParams extends CEHttpParams {
  year: number;
}

@Injectable({
  providedIn: 'root'
})
export class CEDataService {

  constructor(private api: CEApiService) { }

  /**
   * Return CEData for the CEData graphic.
   */
  public async getCEComplianceData() {
    const ceData: CEData = this.api.get('ceData', { year: 2022 });
  }
}
