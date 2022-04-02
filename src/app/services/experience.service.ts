import { Injectable } from '@angular/core';

import { CECategoryList } from '../models/category';
import { AddExDTO, CEExperience, CEUnit } from '../models/experience';
import { CELocation } from '../models/location';

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
      location: {
        ceLocationId: 1,
        name: 'Home'
      },
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
        ceExperienceAmountId: 1,
        ceExperienceId: 1,
        ceUnitId: 2,
        amount: 75
      },{
        ceExperienceAmountId: 2,
        ceExperienceId: 1,
        ceUnitId: 1,
        amount: 1.5
      }]
    },
    {
      ceExperienceId: 2,
      userId: 1,
      location: {
        ceLocationId: 3,
        name: 'Other'
      },
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
        ceExperienceAmountId: 3,
        ceExperienceId: 2,
        ceUnitId: 2,
        amount: 50
      },{
        ceExperienceAmountId: 4,
        ceExperienceId: 2,
        ceUnitId: 1,
        amount: 1
      }]
    },
      {
        ceExperienceId: 3,
        userId: 1,
        location: {
          ceLocationId: 2,
          name: 'Work'
        },
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
          ceExperienceAmountId: 5,
          ceExperienceId: 3,
          ceUnitId: 2,
          amount: 25
        },{
          ceExperienceAmountId: 6,
          ceExperienceId: 3,
          ceUnitId: 1,
          amount: 0.5
        }]
    }];

    return experiences;
  }

  /**
   * Return amount field information for the
   * add CE form.
   */
  public fetchUnitInfo(): CEUnit[] {
    return [{
      ceUnitId: 1,
      parentUnitId: 2,
      unitSingular: 'Hr.',
      unitPlural: 'Hrs.',
      isDisabled: true,
      conversionFormula: '/50'
    },
    {
      ceUnitId: 2,
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
  public fetchCategoryLists(): CECategoryList[] {
    return [{
      ceCategoryListId: 7,
      name: 'generalCategories',
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
      name: 'bias',
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
      name: 'organized',
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

  /**
   * Fetch location info.
   */
  public fetchLocations(): CELocation[] {
    return [{
      ceLocationId: 1,
      name: 'Home'
    },{
      ceLocationId: 2,
      name: 'Work'
    },{
      ceLocationId: 3,
      name: 'Online'
    },{
      ceLocationId: 4,
      name: 'Other'
    }];
  }

/**
 * API call to add an experience.
 *
 * @param addExDTO experience DTO object.
 */
public addExperience(addExDTO: AddExDTO): CEExperience {
  const ceExperience: CEExperience =  new CEExperience();

  ceExperience.ceExperienceId = Math.round(Math.random()*20);
  ceExperience.amounts =  [{
    ceExperienceAmountId: 0,
    ceExperienceId: ceExperience.ceExperienceId,
    ceUnitId: 2,
    amount: addExDTO.timeSpentParent
  },{
    ceExperienceAmountId: 0,
    ceExperienceId: ceExperience.ceExperienceId,
    ceUnitId: 1,
    amount: addExDTO.timeSpentChild
  }];

  ceExperience.carryForward = addExDTO.carryForward || false;
  ceExperience.description = addExDTO.description || '';
  ceExperience.notes = addExDTO.notes || '';
  ceExperience.startDate = addExDTO.startDate;
  ceExperience.endDate = addExDTO.startDate;
  ceExperience.programTitle = addExDTO.programTitle;
  ceExperience.eventName = addExDTO.eventName || '';
  ceExperience.location = this.fetchLocations().find(l => l.ceLocationId === addExDTO.ceLocationId) || new CELocation();
  ceExperience.userId = 1;

  // Add categories


  return ceExperience;
}

/**
 * API call to update an experience.
 *
 * @param updateExDTO experience DTO object.
 */
 public updateExperience(updateExDTO: AddExDTO, exp: CEExperience): CEExperience {
  const ceExperience: CEExperience =  new CEExperience();


 }

}
