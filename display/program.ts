import { VNode } from "snabbdom"

export interface Program<T, M extends ProgramMessage> {
  initialCommand(): M
  update(state: T | undefined, message: M): T
  view(state: T): VNode
}

export interface ProgramMessage {
  type: string
  meta?: string
}

export class BackstageMessage implements ProgramMessage {
  meta: "backstage" = "backstage"
  constructor(public type: string) {}
}

export function isBackstageMessage (message: ProgramMessage): boolean {
  return message.meta === "backstage"
}