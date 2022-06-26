import { Store, Action, applyMiddleware, createStore, Reducer } from "redux"
import { View } from "./markup"
import { produce } from "immer"
import { EffectHandler, effectMiddleware } from "./effect"
import { BACKSTAGE_MESSAGE_TYPE, handleBackstageMessage } from "./backstage"
import { BATCH_MESSAGE_TYPE, handleBatchMessage } from "./batch"
import { attributesModule, classModule, eventListenersModule, init, propsModule, VNode } from "snabbdom"

export interface DisplayConfig<T, M extends Action<any>> {
  update(state: T, message: M): void
  view(state: T): View
}

function getInitialState() {
  return (window as any)._display_initial_state
}

export function createReducer<T, M extends Action<any>>(display: DisplayConfig<T, M>): Reducer<T, M> {
  return function (state: T = getInitialState(), message: M): T {
    return produce(state, (draft) => {
      display.update(draft as T, message)
    })
  }
}

function effectHandlers(): Map<string, EffectHandler> {
  const handlers = new Map<string, EffectHandler>()
  handlers.set(BACKSTAGE_MESSAGE_TYPE, handleBackstageMessage)
  handlers.set(BATCH_MESSAGE_TYPE, handleBatchMessage)
  return handlers
}

export class AppDisplay<T, M extends Action<any>> {
  private store: Store<T, M>

  constructor(private config: DisplayConfig<T, M>) {
    this.store = createStore(createReducer(this.config), applyMiddleware(effectMiddleware(effectHandlers())))
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