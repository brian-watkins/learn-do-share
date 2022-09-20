import { Store, Action, applyMiddleware, createStore, Reducer } from "redux"
import { View } from "./markup"
import { produce } from "immer"
import { effectMiddleware, MessageRegistry } from "./effect"
import { attributesModule, classModule, eventListenersModule, init, propsModule, VNode } from "snabbdom"
import { Procedure, ReducerMessage } from "./procedure"

export interface DisplayConfig<S> {
  view(state: S): View
  procedures?: Array<Procedure<any, S>>
}


function createReducer<T, M extends Action<string>>(initialState: T): Reducer<T, M> {
  return function (state: T = initialState, message: M): T {
    if (message.type !== "__update-view") {
      return state
    }

    const reducerMessage = message as unknown as ReducerMessage<M, T>

    return produce(state, (draft) => {
      reducerMessage.reducer(draft as T, reducerMessage.payload)
    })
  }
}

export class AppDisplay<S, M extends Action<string>> {
  private appRoot: HTMLElement | null = null
  private store: Store<S, M>
  private displayMessageListenerController = new AbortController()
  private messageRegistry = new MessageRegistry<any, S>()

  constructor(private config: DisplayConfig<S>, initialState: S) {
    this.store = createStore(createReducer(initialState), applyMiddleware(effectMiddleware(this.messageRegistry)))
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

    for (const procedure of this.config.procedures ?? []) {
      procedure.register(this.messageRegistry.register.bind(this.messageRegistry))
    }

    handleUpdate()
  }

  destroy() {
    this.displayMessageListenerController.abort()
    this.appRoot?.childNodes.forEach(node => node.remove())
  }
}