import { Store, Action, applyMiddleware, createStore, Reducer } from "redux"
import { View } from "./markup"
import { produce } from "immer"
import { SESSION_MESSAGE_TYPE } from "./session"
import { EffectHandler, effectMiddleware } from "./effect"
import { BACKSTAGE_MESSAGE_TYPE, handleBackstageMessage } from "./backstage"
import { BATCH_MESSAGE_TYPE, handleBatchMessage } from "./batch"
import { attributesModule, classModule, eventListenersModule, init, propsModule, VNode } from "snabbdom"

export type SubscriptionHandler<T> = (model: T, dispatch: (message: any) => void) => void

export interface DisplayConfig<T, M extends Action<any>> {
  update(state: T, message: M): void
  view(state: T): View
  subscription?: SubscriptionHandler<T>
}

function getInitialState() {
  return (window as any)._display_initial_state
}

export function createReducer<T, M extends Action<any>>(display: DisplayConfig<T, M>): Reducer<T, M> {
  return function (state: T = getInitialState(), message: M): T {
    console.log("Main reducer handling message", message)
    if (message.type === SESSION_MESSAGE_TYPE) {
      console.log("Patchng the state with a session message!!!", state, message)
      return { ...state, ...(message as any).slice }
    }

    return produce(state, (draft) => {
      display.update(draft as T, message)
    })
  }
}

function effectHandlers(): Map<string, EffectHandler> {
  const handlers = new Map<string, EffectHandler>()
  handlers.set(BACKSTAGE_MESSAGE_TYPE, handleBackstageMessage)
  handlers.set(BATCH_MESSAGE_TYPE, handleBatchMessage)
  // handlers.set(SESSION_MESSAGE_TYPE, handleSessionMessage)
  return handlers
}

export class AppDisplay<T, M extends Action<any>> {
  private store: Store<T, M>

  constructor(private rootSelector: string, private config: DisplayConfig<T, M>) {
    this.store = createStore(createReducer(this.config), applyMiddleware(effectMiddleware(effectHandlers())))
  }

  dispatch(message: M) {
    this.store.dispatch(message)
  }

  start() {
    const patch = init([
      propsModule,
      attributesModule,
      classModule,
      eventListenersModule
    ])

    // element should be configurable
    const appRoot = document.querySelector(this.rootSelector)

    if (appRoot) {
      document.body.addEventListener("displayMessage", (evt) => {
        const displayMessageEvent = evt as CustomEvent<any>
        this.store.dispatch(displayMessageEvent.detail)
      })

      let oldNode: Element | VNode = appRoot
      const handleUpdate = () => {
        console.log("Updating the view!")
        oldNode = patch(oldNode, this.config.view(this.store.getState()))
      }
      this.store.subscribe(handleUpdate)

      if (this.config.subscription) {
        this.store.subscribe(() => {
          this.config.subscription?.(this.store.getState(), this.store.dispatch)
        })
      }

      handleUpdate()
    }
  }
}