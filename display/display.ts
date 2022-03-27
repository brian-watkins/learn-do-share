import { View } from "./markup"

export interface Display<T, M> {
  initialCommand(): M
  update(state: T | undefined, message: M): T
  view(state: T): View
}
