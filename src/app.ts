import { LearningAreasLoaded, LearningAreasLoading, LearningAreasContent, learningAreasView } from "./learningAreas"
import { LearningAreasRequested, LearningAreasResponse } from "./requestLearningAreas"
import * as Html from "../display/markup"
import { loadingIndicatorView } from "./loadingIndicatorView"
import { DataMessage } from "./backstage"
import { BackstageMessage } from "../display/backstage"
import { Display } from "../display/display"

interface AppState {
  learningAreasContent: LearningAreasContent
}

function initialState(): AppState {
  return {
    learningAreasContent: new LearningAreasLoading()
  }
}

type DisplayMessage = LearningAreasResponse

function update(state: AppState = initialState(), action: DisplayMessage): AppState {
  switch (action.type) {
    case "learningAreasResponse":
      return {
        learningAreasContent: new LearningAreasLoaded(action.learningAreas)
      }
    default:
      return state
  }
}

function initialCommand() {
  return new BackstageMessage(new LearningAreasRequested())
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


const display: Display<AppState, DisplayMessage | BackstageMessage<DataMessage>> = {
  initialCommand,
  update,
  view
}

export default display