
export type MessageHandler<T> = (message: T) => Promise<any>

export interface Backstage<T, M> {
  messageHandler: MessageHandler<T>
  initialState(userIdentifier: string | null): Promise<M>
}