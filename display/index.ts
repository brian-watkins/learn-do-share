import { init, propsModule, VNode } from "snabbdom"
import { createStore, applyMiddleware } from "redux"
import program from "../src/app"


const requestMiddleware = (store: any) => (next: any) => (action: any) => {
  if (action.meta == "request") {
    fetch("/api/backstage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(action)
    }).then((response) => {
      return response.json()
    }).then((responseMessage) => {
      store.dispatch(responseMessage)
    })
  } else {
    next(action)
  }
}

const store = createStore(program.update, applyMiddleware(requestMiddleware))

const patch = init([
  propsModule
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
