import { LearningAreasContent, learningAreasView, LearningAreaOpened, LearningArea, learningAreasLoading, learningAreasLoaded } from "./learningAreas"
import { LearningAreasRequested, LearningAreasResponse } from "./requestLearningAreas"
import * as Html from "../display/markup"
import { loadingIndicatorView } from "./loadingIndicatorView"
import { DataMessage } from "./backstage"
import { BackstageMessage } from "../display/backstage"
import { Display } from "../display/display"

interface AppState {
  learningAreasContent: LearningAreasContent
  selectedLearningArea: LearningArea | null
}

function initialState(): AppState {
  return {
    learningAreasContent: learningAreasLoading(),
    selectedLearningArea: null
  }
}

type DisplayMessage = LearningAreasResponse | LearningAreaOpened

function update(state: AppState, action: DisplayMessage): void {
  switch (action.type) {
    case "learningAreasResponse":
      state.learningAreasContent = learningAreasLoaded(action.learningAreas)
      break

    case "learningAreaOpened":
      state.selectedLearningArea = action.area
      break
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
      return learningAreasView(model.learningAreasContent.areas, model.selectedLearningArea)
  }
}


const display: Display<AppState, DisplayMessage | BackstageMessage<DataMessage>> = {
  initialState,
  initialCommand,
  update,
  view
}

export default display