import { ICategoryList } from '@app/models/category'
import { IUnit, IUnitResponse } from '@app/models/experience'
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from './store-features/request-status.feature'
import { Observable, pipe, switchMap, tap } from 'rxjs'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { ApiService } from '@app/services/api.service'
import { inject } from '@angular/core'
import { tapResponse } from '@ngrx/operators'

type StaticDataStoreState = {
  units: IUnit[]
  categoryLists: ICategoryList[]
  locations: Location[]
}

export const StaticDataStore = signalStore(
  { providedIn: 'root' },
  withState<StaticDataStoreState>({
    units: [],
    categoryLists: [],
    locations: [],
  }),
  withRequestStatus(),
  withMethods((store) => {
    const api = inject(ApiService)

    return {
      loadUnits: rxMethod<number>(
        pipe(
          tap(() => patchState(store, setPending())),
          switchMap((nationalStandardId) => {
            return new Observable((observer) => {
              if (store.units()) {
                observer.next(store.units())
                observer.complete()
              } else {
                api.get<IUnitResponse>(`/units/nationalStandardId/${nationalStandardId}`).pipe(
                  tapResponse({
                    next: (res) => patchState(store, { units: res.units }, setFulfilled()),
                    error: (err: any) => patchState(store, setError(err.message)),
                  }),
                )
              }
            })
          }),
        ),
      ),
    }
    //   public getUnits(nationalStandardId: number): Observable<IUnit[]> {
    //     return new Observable((observer) => {
    //       if (this._units) {
    //         observer.next(this._units)
    //         observer.complete()
    //       } else {
    //         this.fetchUnitInfo(nationalStandardId).subscribe({
    //           next: (res) => {
    //             this._units = res
    //             observer.next(this._units)
    //             observer.complete()
    //           },
    //           error: (err) => {
    //             observer.error(err)
    //           },
    //         })
    //       }
    //     })
    //   }

    //   private fetchUnitInfo(nationalStandardId: number): Observable<IUnit[]> {
    //     return this.api.get<IUnitResponse>(`/units/nationalStandardId/${nationalStandardId}`).pipe(
    //       map((res) => res.units),
    //       catchError((err) => {
    //         return throwError(() => err)
    //       }),
    //     )
    //   }
  }),
)
