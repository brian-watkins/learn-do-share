import { Action, Reducer } from "redux"
import { View } from "./markup"
import { produce } from "immer"
import { SESSION_MESSAGE_TYPE } from "./session"

export type SubscriptionHandler<T> = (model: T, dispatch: (message: any) => void) => void

export interface Display<T, M> {
  update(state: T, message: M): void
  view(state: T): View
  subscription?: SubscriptionHandler<T>
}

function getInitialState() {
  return (window as any)._display_initial_state
}

export function createReducer<T, M extends Action<any>>(display: Display<T, M>): Reducer<T, M> {
  return function (state: T = getInitialState(), message: M): T {
    if (message.type === SESSION_MESSAGE_TYPE) {
      console.log("Patchng the state with a session message!!!", state)
      return { ...state, ...(message as any).slice }
    }

    return produce(state, (draft) => {
      display.update(draft as T, message)
    })
  }
}