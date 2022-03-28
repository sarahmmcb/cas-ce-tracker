import { Injectable } from '@angular/core';

import { CECategory } from '../models/category';
import { CEData, ComplianceStatus } from '../models/cedata';

@Injectable({
  providedIn: 'root'
})
export class CEDataService {

  /**
   * Hard coded category list.
   */
  public categories: CECategory[] = [
    {
      ceCategoryId: 1,
      parentCategoryId: 0,
      nationalStandardId: 1,
      categoryListId: 0,
      name: 'Total',
      displayName: 'Total',
      description: 'Total CE units',
      startYear: 1990,
      endYear: 9999,
      isProgressShown: true,
    },
    {
      ceCategoryId: 2,
      parentCategoryId: 0,
      nationalStandardId: 2,
      categoryListId: 0,
      name: 'Professionalism',
      displayName: 'Professionalism',
      description: 'Category for Professionalism',
      startYear: 1990,
      endYear: 9999,
      isProgressShown: true,
    },
    {
      ceCategoryId: 3,
      parentCategoryId: 0,
      nationalStandardId: 2,
      categoryListId: 0,
      name: 'Organized',
      displayName: 'Organized CE',
      description: 'Category for organized General CE',
      startYear: 1990,
      endYear: 9999,
      isProgressShown: true,
    }
  ];

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
