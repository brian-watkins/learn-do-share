import { classModule, init, propsModule, VNode } from "snabbdom"
import { createStore, applyMiddleware } from "redux"
import { EffectHandler, effectMiddleware } from "./effect"
import program from "../src/app"
import { BACKSTAGE_MESSAGE_TYPE, handleBackstageMessage } from "./backstage"

function effectHandlers(): Map<string, EffectHandler> {
  const handlers = new Map<string, EffectHandler>()
  handlers.set(BACKSTAGE_MESSAGE_TYPE, handleBackstageMessage)
 
  return handlers
}

const store = createStore(program.update, applyMiddleware(effectMiddleware(effectHandlers())))

const patch = init([
  propsModule,
  classModule
])

const appRoot = document.getElementById("app")

if (appRoot) {
  let oldNode: Element | VNode = appRoot
  const handleUpdate = () => {
    oldNode = patch(oldNode, program.view(store.getState()))
  }
  store.subscribe(handleUpdate)

  handleUpdate()
  store.dispatch(program.initialCommand())
}
