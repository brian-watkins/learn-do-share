import { Store, Action, applyMiddleware, createStore, Reducer } from "redux"
import { View } from "./markup"
import { produce } from "immer"
import { EffectHandler, effectMiddleware } from "./effect"
import { BATCH_MESSAGE_TYPE, handleBatchMessage } from "./batch"
import { attributesModule, classModule, eventListenersModule, init, propsModule, VNode } from "snabbdom"
import { Subscription, UpdateFunction } from "./subscription"

export interface DisplayConfig<T, M extends Action<any>> {
  view(state: T): View
  subscriptions: Array<Subscription<T, M>>
}

function getInitialState() {
  return (window as any)._display_initial_state
}

export function createReducer<T, M extends Action<any>>(display: DisplayConfig<T, M>, initialState: T): Reducer<T, M> {
  const handlers = new Map<string, UpdateFunction<T, M>>()

  for (const subscription of display.subscriptions) {
    if (subscription.update !== undefined) {
      handlers.set(subscription.messageType, subscription.update)
    }
  }

  return function (state: T = initialState, message: M): T {
    return produce(state, (draft) => {
      handlers.get(message.type)?.(draft as T, message)
    })
  }
}

function effectHandlers<T, M extends Action<any>>(subscriptions: Array<Subscription<T, M>>): Map<string, EffectHandler> {
  const handlers = new Map<string, EffectHandler>()
  for (const subscription of subscriptions) {
    if (subscription.dispatch != undefined) {
      handlers.set(subscription.messageType, subscription.dispatch)
    }
  }
  handlers.set(BATCH_MESSAGE_TYPE, handleBatchMessage)
  return handlers
}

export class AppDisplay<T, M extends Action<any>> {
  private store: Store<T, M>

  constructor(private config: DisplayConfig<T, M>, initialState: T = getInitialState()) {
    this.store = createStore(createReducer(this.config, initialState), applyMiddleware(effectMiddleware(effectHandlers(config.subscriptions))))
  }

  dispatch(message: M) {
    this.store.dispatch(message)
  }

  mount(selector: string) {
    const patch = init([
      propsModule,
      attributesModule,
      classModule,
      eventListenersModule
    ])

    const appRoot = document.querySelector(selector)

    if (!appRoot) {
      throw new Error(`Mount point element matching selector not found: ${selector}`)
    }

    document.body.addEventListener("displayMessage", (evt) => {
      const displayMessageEvent = evt as CustomEvent<any>
      this.store.dispatch(displayMessageEvent.detail)
    })

    let oldNode: Element | VNode = appRoot
    const handleUpdate = () => {
      oldNode = patch(oldNode, this.config.view(this.store.getState()))
    }
    this.store.subscribe(handleUpdate)

    handleUpdate()
  }
}