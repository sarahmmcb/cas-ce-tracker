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

  public fetchCategoryLists(): Observable<CECategoryList[]> {
    return this.api.get('/categoryLists').pipe(
      tap(res => res.body)
    );
  }

  public fetchLocations(): Observable<CELocation[]> {
    return this.api.get('/locations').pipe(
      tap(res => res.body)
    );
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
