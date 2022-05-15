import { User } from "../common/user"

export type MessageHandler<T> = (user: User | null, message: T) => Promise<any>

export interface Backstage<T> {
  messageHandler: MessageHandler<T>
}