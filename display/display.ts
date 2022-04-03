import { Action, Reducer } from "redux"
import { View } from "./markup"
import { produce } from "immer"
import { EffectHandler } from "./effect"

export interface Display<T, M> {
  initialState(): T
  initialCommand(): M
  update(state: T, message: M): void
  actions: { [key:string]: EffectHandler }
  view(state: T): View
}

export function createReducer<T, M extends Action<any>>(display: Display<T, M>): Reducer<T, M> {
  return function (state: T = display.initialState(), message: M): T {
    return produce(state, (draft) => {
      display.update(draft as T, message)
    })
  }
}