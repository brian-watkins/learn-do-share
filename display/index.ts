import { classModule, eventListenersModule, init, propsModule, VNode } from "snabbdom"
import { createStore, applyMiddleware } from "redux"
import { EffectHandler, effectMiddleware } from "./effect"
import display from "../src/app"
import { BACKSTAGE_MESSAGE_TYPE, handleBackstageMessage } from "./backstage"
import { createReducer } from "./display"

function effectHandlers(): Map<string, EffectHandler> {
  const handlers = new Map<string, EffectHandler>()
  handlers.set(BACKSTAGE_MESSAGE_TYPE, handleBackstageMessage)
 
  return handlers
}

const store = createStore(createReducer(display), applyMiddleware(effectMiddleware(effectHandlers())))

const patch = init([
  propsModule,
  classModule,
  eventListenersModule
])

const appRoot = document.getElementById("app")

if (appRoot) {
  document.body.addEventListener("displayMessage", (evt) => {
    const displayMessageEvent = evt as CustomEvent<any>
    store.dispatch(displayMessageEvent.detail)
  })

  let oldNode: Element | VNode = appRoot
  const handleUpdate = () => {
    oldNode = patch(oldNode, display.view(store.getState()))
  }
  store.subscribe(handleUpdate)

  handleUpdate()
  store.dispatch(display.initialCommand())
}
