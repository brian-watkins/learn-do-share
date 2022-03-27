import { LearningAreasLoaded, LearningAreasLoading, LearningAreasContent, learningAreasView } from "./learningAreas"
import { LearningAreasRequested, LearningAreasResponse } from "./requestLearningAreas"
import { Program } from "../display/program"
import * as Html from "../display/markup"
import { loadingIndicatorView } from "./loadingIndicatorView"

interface AppState {
  learningAreasContent: LearningAreasContent
}

function initialState(): AppState {
  return {
    learningAreasContent: new LearningAreasLoading()
  }
}

type ActionMessage = LearningAreasResponse | LearningAreasRequested

function update(state: AppState = initialState(), action: ActionMessage): AppState {
  switch (action.type) {
    case "learningAreasResponse":
      return {
        learningAreasContent: new LearningAreasLoaded(action.learningAreas)
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
  switch (model.learningAreasContent.type) {
    case "learningAreasLoading":
      return loadingIndicatorView()
    case "learningAreasLoaded":
      return learningAreasView(model.learningAreasContent.areas)
  }
}


const ldsProgram: Program<AppState, ActionMessage> = {
  initialCommand,
  update,
  view
}

export default ldsProgram