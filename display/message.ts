import { Action } from "redux"

export type UpdateFunction<T, M> = (state: T, message: M) => void
export type DispatcherFunction<T, M> = (dispatch: (message: M) => void, state: T, message: M) => void

export interface Subscription<T, M> {
  messageType: string
  update?: UpdateFunction<T, M>
  dispatch?: DispatcherFunction<T, M>
}

export interface SubscriptionDetails<T, M> {
  do?: DispatcherFunction<T, M>
  update?: UpdateFunction<T, M>
}

export function subscribe<T, M extends Action<string>, V extends M["type"]>(message: V, builder: SubscriptionDetails<T, Extract<M, { type: V }>>): Subscription<T, M> {
  const subscription: Subscription<T, M> = {
    messageType: message
  }

  if (builder.do) {
    subscription.dispatch = function(dispatch, state, message) {
      builder.do?.(dispatch, state, message as Extract<M, { type: V }>)
    }
  }
  
  if (builder.update) {
    subscription.update = function(state, message) {
      builder.update?.(state, message as Extract<M, { type: V }>)
    }
  }

  return subscription
}
