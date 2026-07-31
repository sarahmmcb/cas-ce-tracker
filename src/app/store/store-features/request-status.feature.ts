import { signalStoreFeature, withComputed, withState } from '@ngrx/signals'

export type RequestStatus = 'idle' | 'pending' | 'fulfilled' | { error: string }
export type RequestStatusState = { requestStatus: RequestStatus }

export function withRequestStatus() {
  return signalStoreFeature(
    withState<RequestStatusState>({ requestStatus: 'idle' }),
    withComputed(({ requestStatus }) => ({
      isPending: () => requestStatus() === 'pending',
      isFulfilled: () => requestStatus() === 'fulfilled',
      error: () => {
        const status = requestStatus()
        return typeof status === 'object' ? status.error : null
      },
    })),
  )
}

export const setPending = () => {
  requestStatus: 'pending'
}

export const setFulfilled = () => {
  requestStatus: 'fulfilled'
}

export const setError = (msg: string) => {
  requestStatus: {
    error: msg
  }
}
