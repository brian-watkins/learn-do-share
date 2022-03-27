export type MessageDispatcher = (message: any) => void

export type EffectHandler = (dispatch: MessageDispatcher, message: any) => void

export const effectMiddleware = (effectHandlers: Map<string,EffectHandler>) => (store: any) => (next: any) => (message: any) => {
  const handler = effectHandlers.get(message.type)
  if (handler) {
    handler(store.dispatch, message)
  } else {
    next(message)
  }
}

