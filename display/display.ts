import { Action, Reducer } from "redux"
import { View } from "./markup"
import { produce } from "immer"

export interface Display<T, M> {
  update(state: T, message: M): void
  view(state: T): View
}

function getInitialState() {
  return (window as any)._display_initial_state
}

export function createReducer<T, M extends Action<any>>(display: Display<T, M>): Reducer<T, M> {
  return function (state: T = getInitialState(), message: M): T {
    return produce(state, (draft) => {
      display.update(draft as T, message)
    })
  }
}