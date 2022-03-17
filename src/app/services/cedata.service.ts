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
  public getCEComplianceData(): CEData {
    const ceData: CEData = {
      title: 'Progress for CE Year 2023',
      unitLongName: 'Hours',
      unitShortName: 'Hrs.',
      categoryGroups: [
        {
          categories: [
            {
              displayName: 'Total',
              goal: 30,
              amountCompleted: 10,
              percentCompleted: 33
            }
          ]
        },
        {
          categories: [
          {
            displayName: 'Professionalism',
            goal: 6,
            amountCompleted: 4,
            percentCompleted: 66
          },
          {
            displayName: 'Bias',
            goal: 1,
            amountCompleted: 1,
            percentCompleted: 100
          },
          {
            displayName: 'General Business',
            goal: 3,
            amountCompleted: 2,
            percentCompleted: 66
          }]
        },
        {
          categories: [
            {
              displayName: 'Specific CE',
              goal: 15,
              amountCompleted: 3,
              percentCompleted: 20
            },
            {
              displayName: 'Specific Organized CE',
              goal: 6,
              amountCompleted: 1,
              percentCompleted: 17
            }
          ]
        }
      ],
      complianceStatus: ComplianceStatus.compliant
    };

    return ceData;
  }
}
