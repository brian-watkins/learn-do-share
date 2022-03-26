import { learningAreasLoaded, learningAreasLoading, LearningAreasState, viewLearningArea } from "./learningAreas"
import { LearningAreasRequested, LearningAreasResponse } from "./requestLearningAreas"
import { Program } from "../display/program"
import * as Html from "../display/markup"

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
  return new LearningAreasRequested()
}

// View

function view(model: AppState): Html.View {
  switch (model.learningAreas.type) {
    case "learningAreasLoading":
      return Html.div([Html.id("loading-indicator")], [Html.text("Loading ...")])
    case "learningAreasLoaded":
      const learningAreas = model.learningAreas.areas
      if (learningAreas.length == 0) {
        return Html.h1([], [Html.text("There is nothing to learn!")])
      }

      return Html.ul([], learningAreas.map(viewLearningArea).map(asListItem))
  }
}

function asListItem(node: Html.ViewChild): Html.ViewChild {
  return Html.li([], [node])
}

const ldsProgram: Program<AppState, ActionMessage> = {
  initialCommand,
  update,
  view
}

export default ldsProgram