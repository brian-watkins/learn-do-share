
export type MessageHandler<T> = (message: T) => Promise<any>

export interface Backstage<T> {
  messageHandler: MessageHandler<T>
  initialState(): Promise<any>
}