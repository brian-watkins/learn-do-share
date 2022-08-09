import { MessageDispatcher } from "./effect"

export const BATCH_MESSAGE_TYPE = "_batch"

export interface BatchMessage<T> {
  type: typeof BATCH_MESSAGE_TYPE
  children: Array<T>
}

export function batch<T>(messages: Array<T>): BatchMessage<T> {
  return {
    type: BATCH_MESSAGE_TYPE,
    children: messages
  }
}

export function handleBatchMessage(dispatch: MessageDispatcher, _: any, message: BatchMessage<any>) {
  message.children.forEach(dispatch)
}
