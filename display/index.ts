import { attributesModule, classModule, eventListenersModule, init, propsModule, VNode } from "snabbdom"
import { createStore, applyMiddleware } from "redux"
import { EffectHandler, effectMiddleware } from "./effect"
import display from "../src/app"
import { BACKSTAGE_MESSAGE_TYPE, handleBackstageMessage } from "./backstage"
import { createReducer } from "./display"

function effectHandlers(actions: { [key:string]: EffectHandler }): Map<string, EffectHandler> {
  const handlers = new Map<string, EffectHandler>()
  handlers.set(BACKSTAGE_MESSAGE_TYPE, handleBackstageMessage)
  for (const action in actions) {
    handlers.set(action, actions[action])
  }
 
  return handlers
}

const store = createStore(createReducer(display), applyMiddleware(effectMiddleware(effectHandlers(display.actions))))

const patch = init([
  propsModule,
  attributesModule,
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
