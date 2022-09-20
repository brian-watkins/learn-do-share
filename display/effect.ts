import { BATCH_MESSAGE_TYPE, handleBatchMessage } from "./batch"
import { Procedure, reducerMessage } from "./procedure"

export type MessageDispatcher = (message: any) => void
export type MessageForwarder = (message: any) => void

export type EffectHandler = (dispatch: MessageDispatcher, state: any, message: any) => void

export type Processor = (forward: MessageForwarder, dispatch: MessageDispatcher, state: any, message: any) => void | Promise<void>

export class MessageRegistry<V, S> {
  private registry = new Map<string, Procedure<V, S>>()
  register(messageName: string, procedure: Procedure<V, S>) {
    this.registry.set(messageName, procedure)
  }

  handle(forward: MessageForwarder, dispatcher: MessageDispatcher, message: any) {
    const procedure = this.registry.get(message.type)
    if (!procedure) {
      forward(message)
      return
    }
    if (procedure.reducer) {
      forward(reducerMessage(message, procedure.reducer))
    }
    if (procedure.next) {
      procedure.next(dispatcher, message)
    }
  }
}

export const effectMiddleware = <V, S>(messageRegistry: MessageRegistry<V, S>) => {
  return (store: any) => (next: any) => (message: any) => {
    if (message.type === BATCH_MESSAGE_TYPE) {
      handleBatchMessage(store.dispatch, null, message)
    } else {
      messageRegistry.handle(next, store.dispatch, message)
    }
  }
}
