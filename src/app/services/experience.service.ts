import { Injectable } from '@angular/core';

import { CategoryList } from '../models/category';
import { CEExperience, CEExperienceAmount } from '../models/experience';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {

  constructor() { }

  /**
   * Fetch experiences by year.
   */
  public fetchExperiences(year: number): CEExperience[] {
    const experiences: CEExperience[] = [{
      ceExperienceId: 1,
      userId: 1,
      location: 'Home',
      carryForward: false,
      programTitle: 'Exam Study',
      startDate: '2022-03-01',
      endDate: '2022-03-01',
      categories: [{
        ceCategoryId: 5,
        parentCategoryId: 0,
        nationalStandardId: 2,
        categoryListId: 7,
        name: 'Other Relevant',
        displayName: 'Other Relevant'
      }],
      amounts: [{
        nationalStandardCEUnitId: 1,
        parentUnitId: 2,
        amount: 1,
        unitPlural: 'hrs.',
        unitSingular: 'hr.',
        isDisabled: true,
        conversionFormula: '/50'
      },
      {
        nationalStandardCEUnitId: 2,
        parentUnitId: 0,
        amount: 50,
        unitPlural: 'min.',
        unitSingular: 'min.',
        isDisabled: false,
        conversionFormula: ''
      }]
    },
    {
      ceExperienceId: 2,
      userId: 1,
      location: 'Other',
      carryForward: false,
      programTitle: 'Professionalism Seminar',
      eventName: 'Actuary Conference',
      startDate: '2022-02-12',
      endDate: '2022-02-12',
      description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu',
      categories: [{
        ceCategoryId: 2,
        parentCategoryId: 0,
        nationalStandardId: 2,
        categoryListId: 7,
        name: 'Professionalism',
        displayName: 'Professionalism'
      }, {
        ceCategoryId: 6,
        parentCategoryId: 0,
        nationalStandardId: 2,
        categoryListId: 9,
        name: 'Organized',
        displayName: 'Organized'
      }],
      amounts: [{
        nationalStandardCEUnitId: 1,
        parentUnitId: 2,
        amount: 1.5,
        unitPlural: 'hrs.',
        unitSingular: 'hr.',
        isDisabled: true,
        conversionFormula: '/50'
      },
      {
        nationalStandardCEUnitId: 2,
        parentUnitId: 0,
        amount: 75,
        unitPlural: 'min.',
        unitSingular: 'min.',
        isDisabled: false,
        conversionFormula: ''
      }]
    },
      {
        ceExperienceId: 3,
        userId: 1,
        location: 'Work',
        carryForward: false,
        programTitle: 'General Business Round Table',
        startDate: '2022-01-11',
        endDate: '2022-01-11',
        description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu',
        notes: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu',
        categories: [{
          ceCategoryId: 4,
          parentCategoryId: 0,
          nationalStandardId: 2,
          categoryListId: 7,
          name: 'General Business',
          displayName: 'General Business'
        }, {
          ceCategoryId: 3,
          parentCategoryId: 0,
          nationalStandardId: 2,
          categoryListId: 8,
          name: 'Bias',
          displayName: 'Bias'
        }, {
          ceCategoryId: 6,
          parentCategoryId: 0,
          nationalStandardId: 2,
          categoryListId: 9,
          name: 'Organized',
          displayName: 'Organized'
        }],
        amounts: [{
          nationalStandardCEUnitId: 1,
          parentUnitId: 2,
          amount: 0.5,
          unitPlural: 'hrs.',
          unitSingular: 'hr.',
          isDisabled: true,
          conversionFormula: '/50'
        },
        {
          nationalStandardCEUnitId: 2,
          parentUnitId: 0,
          amount: 25,
          unitPlural: 'min.',
          unitSingular: 'min.',
          isDisabled: false,
          conversionFormula: ''
        }]
    }];

    return experiences;
  }

  /**
   * Return unit field information for the
   * add CE form.
   */
  public fetchUnitInfo(): CEExperienceAmount[] {
    return [{
      nationalStandardCEUnitId: 1,
      parentUnitId: 2,
      unitSingular: 'Hr.',
      unitPlural: 'Hrs.',
      isDisabled: true,
      conversionFormula: '/50'
    },
    {
      nationalStandardCEUnitId: 2,
      parentUnitId: 0,
      unitSingular: 'Min.',
      unitPlural: 'Min.',
      isDisabled: false,
      conversionFormula: ''
    }];
  }

  /**
   * Return category lists for input ce form.
   */
  public fetchCategoryLists(): CategoryList[] {
    return [{
      ceCategoryListId: 7,
      name: 'General Categories',
      displayQuestion: 'Please indicate the CE Type',
      displayOrder: 1,
      categories: [{
        ceCategoryId: 2,
        parentCategoryId: 0,
        nationalStandardId: 2,
        categoryListId: 7,
        name: 'Professionalism',
        displayName: 'Professionalism'
      },{
        ceCategoryId: 4,
        parentCategoryId: 0,
        nationalStandardId: 2,
        categoryListId: 7,
        name: 'General Business',
        displayName: 'General Business'
      },{
        ceCategoryId: 5,
        parentCategoryId: 0,
        nationalStandardId: 2,
        categoryListId: 7,
        name: 'Other Relevant',
        displayName: 'Other Relevant'
      }]
    },{
      ceCategoryListId: 8,
      name: 'Bias',
      displayQuestion: 'Does this CE include a Bias topic?',
      displayOrder: 2,
      categories: [{
        ceCategoryId: 3,
        parentCategoryId: 0,
        nationalStandardId: 2,
        categoryListId: 8,
        name: 'Bias',
        displayName: 'Bias'
      }]
    },{
      ceCategoryListId: 9,
      name: 'Organized',
      displayQuestion: 'Is this CE organized?',
      displayOrder: 3,
      categories: [{
        ceCategoryId: 6,
        parentCategoryId: 0,
        nationalStandardId: 2,
        categoryListId: 9,
        name: 'Organized',
        displayName: 'Organized'
      }]
    }];
  }
}
