import { Action } from "redux"

export type UpdateFunction<T, M extends Action<any>> = (state: T, message: M) => void
export type DispatcherFunction<T, M extends Action<any>> = (dispatch: (message: M) => void, state: T, message: M) => void

export interface Subscription<T, M extends Action<any>> {
  messageType: string
  update?: UpdateFunction<T, M>
  dispatch?: DispatcherFunction<T, M>
}

export interface SubscriptionDetails<T, M extends Action<any>> {
  do?: DispatcherFunction<T, M>
  update?: UpdateFunction<T, M>
}

export function subscribe<T, M extends Action<any>>(messageType: string, details: SubscriptionDetails<T, M>): Subscription<T, M> {
  return {
    messageType,
    update: details.update,
    dispatch: details.do
  }
}

export function mapSubscriptions<T, S, M extends Action<any>>(subscriptions: Array<Subscription<S, M>>, mapper: (state: T) => S): Array<Subscription<T, M>> {
  return subscriptions.map(sub => {
    return {
      messageType: sub.messageType,
      update: (state: T, message: M) => {
        sub.update?.(mapper(state), message)
      },
      dispatch: (dispatch: (message: M) => void, state: T, message: M) => {
        sub.dispatch?.(dispatch, mapper(state), message)
      }
    }
  })
}
