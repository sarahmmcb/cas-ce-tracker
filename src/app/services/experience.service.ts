import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CEExperience } from '../models/experience';

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
        amount: 1,
        unitPlural: 'hours',
        unitSingular: 'hour'
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
        amount: 1.5,
        unitPlural: 'hours',
        unitSingular: 'hour'
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
          amount: 0.5,
          unitPlural: 'hours',
          unitSingular: 'hour'
        }]
    }];

    return experiences;
  }
}
