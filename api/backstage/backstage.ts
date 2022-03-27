import { BackstageMessage } from "../../display/display"

export type MessageHandler<T> = (message: BackstageMessage<T>) => Promise<any>

export interface Backstage<T> {
  messageHandler: MessageHandler<T>
}