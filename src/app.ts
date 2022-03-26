import { learningAreasLoaded, learningAreasLoading, LearningAreasState, viewLearningArea } from "./learningAreas"
import { learningAreasRequested, LearningAreasRequested, LearningAreasResponse } from "./requestLearningAreas"
import { Program } from "../display/program"
import { h, VNode } from "snabbdom"

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

function initialCommand(): ActionMessage {
  return learningAreasRequested()
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

const ldsProgram: Program<AppState, ActionMessage> = {
  initialCommand,
  update,
  view
}

export default ldsProgram