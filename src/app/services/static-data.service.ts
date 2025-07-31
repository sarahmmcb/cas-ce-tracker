import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { IUnit } from '../models/experience';
import { ICategoryList } from '../models/category';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Location } from '../models/location';

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {

  private _units: IUnit[];
  private _categoryLists: ICategoryList[];
  private _locations: Location[];

  constructor(private api: ApiService) { }

  //#region Units

  public getUnits(nationalStandardId: number): Observable<IUnit[]> {
    return new Observable(observer => {
      if (this._units) {
        observer.next(this._units);
        observer.complete();
      }
      else {
        this.fetchUnitInfo(nationalStandardId)
        .subscribe({
          next: (res) => {
              this._units = res;
              observer.next(this._units);
              observer.complete();
            },
          error: err => {
            observer.error(err)
          }
        });
      }
    });
  }

  private fetchUnitInfo(nationalStandardId: number): Observable<IUnit[]> {
    return this.api.get(`/units/nationalStandardId/${nationalStandardId}`).pipe(
      map(res => res.units),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
  
  //#endregion

 //#region CategoryLists

  public getCategoryLists(
    nationalStandardId: number,
    year: number
  ): Observable<ICategoryList[]> {
    return new Observable(observer => {
      if (this._categoryLists) {
        observer.next(this._categoryLists);
        observer.complete();
      }
      else {
        this.fetchCategoryLists(
          nationalStandardId,
          year).subscribe({
            next: (res) => {
                this._categoryLists = res;
                observer.next(this._categoryLists);
                observer.complete();
              },
            error: err => {
              observer.error(err)
            }
        });
      }
    });
  }

  private fetchCategoryLists(
    nationalStandardId: number,
    year: number
  ): Observable<ICategoryList[]> {
    return this.api
      .get(
        `/categoryLists/nationalStandardId/${nationalStandardId}/year/${year}`
      ).pipe(
        map(res => res.categoryLists),
        catchError(err => throwError(() => err))
      );
  }

 //#endregion

 //#region Locations

  public getLocations(): Observable<Location[]> {
    return new Observable(observer => {
      if (this._locations) {
        observer.next(this._locations);
        observer.complete();
      }
      else {
        this.fetchLocations().subscribe({
          next: (res) => {
              this._locations = res;
              observer.next(this._locations);
              observer.complete();
            },
          error: err => {
            observer.error(err)
          }
        });
      }
    });
  }

  private fetchLocations(): Observable<Location[]> {
    return this.api.get('/locations').pipe(
      map(res => res.locations),
      catchError(err => throwError(() => err))
    );
  }

 //#endregion

}
