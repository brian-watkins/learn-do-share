
export type MessageHandler = (message: any) => Promise<any>

export interface Backstage {
  messageHandler: MessageHandler
}