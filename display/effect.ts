export type MessageDispatcher = (message: any) => void

export type EffectHandler = (dispatch: MessageDispatcher, state: any, message: any) => void

export const effectMiddleware = (process: EffectHandler, effectHandlers: Map<string,EffectHandler>) => (store: any) => (next: any) => (message: any) => {
  const handler = effectHandlers.get(message.type)
  if (handler) {
    handler(store.dispatch, store.getState(), message)
  } else {
    process(store.dispatch, store.getState(), message)
    next(message)
  }
}

