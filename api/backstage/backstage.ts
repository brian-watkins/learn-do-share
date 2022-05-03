import { User } from "../common/user"

export type MessageHandler<T> = (user: User | null, message: T) => Promise<any>

export interface BackstageContext<C> {
  user: User | null
  attributes: C
}

export interface Backstage<C, T, M> {
  messageHandler: MessageHandler<T>
  initialState(context: BackstageContext<C>): Promise<M>
}