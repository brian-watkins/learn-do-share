import { h, init, propsModule, VNode } from "snabbdom"
import { LearningAreasRequested, learningAreasRequested, LearningAreasResponse } from "../src/requestLearningAreas"
import { createStore, applyMiddleware } from "redux"
import { learningAreasLoaded, learningAreasLoading, LearningAreasState, viewLearningArea } from "../src/learningAreas"


interface AppState {
  learningAreas: LearningAreasState
}

function initialState(): AppState {
  return {
    learningAreas: learningAreasLoading()
  }
}

type ActionMessage = LearningAreasResponse | LearningAreasRequested

function update(state: AppState = initialState(), action: ActionMessage): AppState {
  switch (action.type) {
    case "learningAreasResponse":
      return {
        learningAreas: learningAreasLoaded(action.learningAreas)
      }
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

const patch = init([
  propsModule
])

const appRoot = document.getElementById("app")

if (appRoot) {
  let oldNode: Element | VNode = appRoot
  const handleUpdate = () => {
    oldNode = patch(oldNode, view(store.getState()))
  }
  store.subscribe(handleUpdate)
  handleUpdate()
  store.dispatch(learningAreasRequested())
}


// View

function view(model: AppState): VNode {
  switch (model.learningAreas.type) {
    case "learningAreasLoading":
      return h("div", { props: { id: "loading-indicator" } }, 'Loading ...')
    case "learningAreasLoaded":
      const learningAreas = model.learningAreas.areas
      if (learningAreas.length == 0) {
        return h("h1", {}, 'There is nothing to learn!')
      }

      return h("ul", {}, learningAreas.map(viewLearningArea).map(asListItem))
  }
}

function asListItem(node: VNode): VNode {
  return h("li", {}, node)
}