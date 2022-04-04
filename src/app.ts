import { LearningAreasContent, learningAreasView, LearningAreaOpened, LearningArea, learningAreasLoading, learningAreasLoaded } from "./learningAreas"
import { learningAreasRequested, LearningAreasResponse } from "./requestLearningAreas"
import * as Html from "../display/markup"
import { loadingIndicatorView } from "./loadingIndicatorView"
import { DataMessage } from "./backstage"
import { backstageMessage, BackstageMessage } from "../display/backstage"
import { Display } from "../display/display"
import { EngagementPlansContent, EngagementPlansLoaded, engagementPlansLoading, engagementPlansRequested } from "./readEngagementPlans"
import { EngagementPlanPersisted } from "./writeEngagementPlans"
import { batch } from "../display/batch"

interface AppState {
  learningAreasContent: LearningAreasContent
  engagementPlansContent: EngagementPlansContent
  selectedLearningArea: LearningArea | null
}

function initialState(): AppState {
  return {
    learningAreasContent: learningAreasLoading(),
    engagementPlansContent: engagementPlansLoading(),
    selectedLearningArea: null
  }
}

type DisplayMessage
  = LearningAreasResponse
  | LearningAreaOpened
  | EngagementPlanPersisted
  | EngagementPlansLoaded

function update(state: AppState, action: DisplayMessage): void {
  switch (action.type) {
    case "learningAreasResponse":
      state.learningAreasContent = learningAreasLoaded(action.learningAreas)
      break

    case "learningAreaOpened":
      state.selectedLearningArea = action.area
      break

    case "engagementPlanPersisted":
      if (state.learningAreasContent.type === "learningAreasLoaded") {
        switch (state.engagementPlansContent.type) {
          case "engagementPlansLoaded":
            state.engagementPlansContent.plans.push(action.plan)
        }
      }
      break

    case "engagementPlansLoaded":
      state.engagementPlansContent = action
      break
  }
}

function initialCommand() {
  return batch([
    backstageMessage(learningAreasRequested()),
    backstageMessage(engagementPlansRequested())
  ])
}

// View

function view(model: AppState): Html.View {
  switch (model.learningAreasContent.type) {
    case "learningAreasLoading":
      return loadingIndicatorView()
    case "learningAreasLoaded":
      return learningAreasView(model.learningAreasContent.areas, model.selectedLearningArea, model.engagementPlansContent)
  }
}


const display: Display<AppState, DisplayMessage | BackstageMessage<DataMessage>> = {
  initialState,
  initialCommand,
  update,
  view
}

export default display