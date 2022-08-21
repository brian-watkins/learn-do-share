import { Store, Action, applyMiddleware, createStore, Reducer } from "redux"
import { View } from "./markup"
import { produce } from "immer"
import { EffectHandler, effectMiddleware, Processor } from "./effect"
import { BATCH_MESSAGE_TYPE, handleBatchMessage } from "./batch"
import { attributesModule, classModule, eventListenersModule, init, propsModule, VNode } from "snabbdom"

export interface DisplayConfig<T, M extends Action<any>> {
  view(state: T): View
  update?: (state: T, message: M) => void,
  process?: Processor
}

function getInitialState() {
  return (window as any)._display_initial_state
}

export function createReducer<T, M extends Action<any>>(display: DisplayConfig<T, M>, initialState: T): Reducer<T, M> {
  if (display.update === undefined) {
    return function(state: T = initialState, _: M): T {
      return state
    }
  }

  return function (state: T = initialState, message: M): T {
    return produce(state, (draft) => {
      display.update!(draft as T, message)
    })
  }
}

function effectHandlers(): Map<string, EffectHandler> {
  const handlers = new Map<string, EffectHandler>()
  handlers.set(BATCH_MESSAGE_TYPE, handleBatchMessage)
  return handlers
}

export class AppDisplay<T, M extends Action<any>> {
  private appRoot: HTMLElement | null = null
  private store: Store<T, M>
  private displayMessageListenerController = new AbortController()

  constructor(private config: DisplayConfig<T, M>, initialState: T = getInitialState()) {
    this.store = createStore(createReducer(this.config, initialState), applyMiddleware(effectMiddleware(config.process, effectHandlers())))
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

    this.appRoot = document.querySelector(selector)

    if (!this.appRoot) {
      throw new Error(`Mount point element matching selector not found: ${selector}`)
    }

    const mountPoint = document.createElement("div")
    this.appRoot.appendChild(mountPoint)

    this.appRoot.addEventListener("displayMessage", (evt) => {
      const displayMessageEvent = evt as CustomEvent<any>
      this.store.dispatch(displayMessageEvent.detail)
    }, { signal: this.displayMessageListenerController.signal })

    let oldNode: Element | VNode = mountPoint
    const handleUpdate = () => {
      oldNode = patch(oldNode, this.config.view(this.store.getState()))
    }
    this.store.subscribe(handleUpdate)

    handleUpdate()
  }

  destroy() {
    this.displayMessageListenerController.abort()
    this.appRoot?.childNodes.forEach(node => node.remove())
  }
}