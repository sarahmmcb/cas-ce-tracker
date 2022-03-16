import { Injectable } from '@angular/core';

import { CEData, ComplianceStatus } from '../models/cedata';

@Injectable({
  providedIn: 'root'
})
export class CEDataService {

  constructor() { }

  /**
   * Return CEData for the CEData graphic.
   */
  public getCEData(): CEData {
    const ceData: CEData = {
      title: 'Progress for CE Year 2023',
      unitLongName: 'Hours',
      unitShortName: 'Hrs.',
      categoryGroups: [
        {
          categories: []
        },
        {
          categories: []
        }
      ],
      complianceStatus: ComplianceStatus.compliant
    };

    return ceData;
  }
}
