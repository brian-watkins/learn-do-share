import { VNode } from "snabbdom"

export interface Program<T, M> {
  initialCommand(): M
  update(state: T | undefined, message: M): T
  view(state: T): VNode
}
