import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CECategoryList } from '../models/category';
import { AddExDTO, CEExperience, CEUnit } from '../models/experience';
import { CELocation } from '../models/location';
import { CEApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CEExperienceService {

  private experienceSub: BehaviorSubject<CEExperience[]> = new BehaviorSubject<CEExperience[]>([]);

  constructor( private api: CEApiService ) { }

  public get experiences() {
    return this.experienceSub.asObservable();
  }

  public getExperiences(year: number): Observable<CEExperience[]> {
    return this.api.get('/experiences', { year }).pipe(
      tap(experiences => {
        this.experienceSub.next(experiences);
      })
    );
  }

  public fetchUnitInfo(): Observable<CEUnit[]> {
    return this.api.get('/units').pipe(
      tap(res => res.body)
    );
  }

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
    },{
      ceCategoryListId: 10,
      name: 'specific',
      displayQuestion: 'Does this meet USQS Specific Education Requirements under Section 3.3?',
      displayOrder: 4,
      categories: [{
        ceCategoryId: 12,
        parentCategoryId: 0,
        nationalStandardId: 2,
        categoryListId: 10,
        name: 'Specific',
        displayName: 'Specific'
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
public addExperience(addExDTO: AddExDTO, exp: CEExperience = null): void {
  // make API call to update database, return updated experience list
  // and updated ceData object
}

}
