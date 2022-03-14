import { h, init, VNode } from "snabbdom"
import { LearningArea, LearningAreasRequested, learningAreasRequested, LearningAreasResponse, viewLearningArea } from "./requestLearningAreas"
import { createStore, applyMiddleware } from "redux"

interface AppState {
  learningAreas: Array<LearningArea>
}

function initialState(): AppState {
  return {
    learningAreas: []
  }
}

type ActionMessage = LearningAreasResponse | LearningAreasRequested

function update(state: AppState = initialState(), action: ActionMessage): AppState {
  switch(action.type) {
    case "learningAreasResponse":
      return Object.assign({}, state, { learningAreas: action.learningAreas })
    default:
      return state
  }
}

const requestMiddleware = (store: any) => (next: any) => (action: any) => {
  if (action.meta == "request") {
    fetch("/messages", {
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


const store = createStore(update, applyMiddleware(requestMiddleware))

const patch = init([])

const appRoot = document.getElementById("app")

if (appRoot) {
  let oldNode: Element | VNode = appRoot
  store.subscribe(() => {
    console.log("Updating view with state")
    oldNode = patch(oldNode, view(store.getState()))
  })
  store.dispatch(learningAreasRequested())
}


// View

function view(model: AppState) {
  if (model.learningAreas.length == 0) {
    return h("h1", {}, 'There is nothing to learn!')
  }
  
  return h("ul", {}, model.learningAreas.map(viewLearningArea).map(asListItem))
}

function asListItem(node: VNode): VNode {
  return h("li", {}, node)
}