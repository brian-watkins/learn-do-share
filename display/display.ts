import { View } from "./markup"

export interface Display<T, M extends DisplayMessage> {
  initialCommand(): M
  update(state: T | undefined, message: M): T
  view(state: T): View
}

export interface DisplayMessage {
  type: string
}

export class BackstageMessage<T> implements DisplayMessage {
  type: "backstage" = "backstage"
  constructor(public message: T) {}
}

export function isBackstageMessage (message: DisplayMessage): boolean {
  return message.type === "backstage"
}