export type MessageDispatcher = (message: any) => void
export type MessageForwarder = () => void

export type EffectHandler = (dispatch: MessageDispatcher, state: any, message: any) => void

export type Processor = (forward: MessageForwarder, dispatch: MessageDispatcher, state: any, message: any) => void | Promise<void>

export const effectMiddleware = (process: Processor | undefined, effectHandlers: Map<string,EffectHandler>) => (store: any) => (next: any) => (message: any) => {
  const handler = effectHandlers.get(message.type)
  if (handler) {
    handler(store.dispatch, store.getState(), message)
  } else {
    if (process === undefined) {
      next(message)
    } else {
      const forward = () => { next(message) }
      process(forward, store.dispatch, store.getState(), message)
    }
  }
}

