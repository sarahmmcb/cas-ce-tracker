import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
      categories: ['Other Relevant'],
      amounts: [{
        nationalStandardCEUnitId: 1,
        parentUnitId: 2,
        amount: 1,
        unitPlural: 'hrs.',
        unitSingular: 'hr.',
        isEditable: false,
        conversionFormula: '/50'
      },
      {
        nationalStandardCEUnitId: 2,
        parentUnitId: 0,
        amount: 50,
        unitPlural: 'min.',
        unitSingular: 'min.',
        isEditable: true,
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
      categories: ['Professionalism', 'Organized'],
      amounts: [{
        nationalStandardCEUnitId: 1,
        parentUnitId: 2,
        amount: 1.5,
        unitPlural: 'hrs.',
        unitSingular: 'hr.',
        isEditable: false,
        conversionFormula: '/50'
      },
      {
        nationalStandardCEUnitId: 2,
        parentUnitId: 0,
        amount: 75,
        unitPlural: 'min.',
        unitSingular: 'min.',
        isEditable: true,
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
        categories: ['General Business', 'Bias','Organized'],
        amounts: [{
          nationalStandardCEUnitId: 1,
          parentUnitId: 2,
          amount: 0.5,
          unitPlural: 'hrs.',
          unitSingular: 'hr.',
          isEditable: false,
          conversionFormula: '/50'
        },
        {
          nationalStandardCEUnitId: 2,
          parentUnitId: 0,
          amount: 25,
          unitPlural: 'min.',
          unitSingular: 'min.',
          isEditable: true,
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
      isEditable: false,
      conversionFormula: '/50'
    },
    {
      nationalStandardCEUnitId: 2,
      parentUnitId: 0,
      unitSingular: 'Min.',
      unitPlural: 'Min.',
      isEditable: true,
      conversionFormula: ''
    }];
  }
}
