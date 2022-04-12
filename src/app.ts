import { LearningAreasContent, learningAreasView, LearningAreaOpened, LearningArea, learningAreasLoaded } from "./learningAreas"
import { LearningAreasResponse } from "./requestLearningAreas"
import * as Html from "../display/markup"
import { loadingIndicatorView } from "./loadingIndicatorView"
import { DataMessage } from "./backstage"
import { BackstageMessage } from "../display/backstage"
import { Display } from "../display/display"
import { EngagementPlansContent, EngagementPlansLoaded } from "./readEngagementPlans"
import { EngagementPlanPersisted } from "./writeEngagementPlans"

export interface AppState {
  learningAreasContent: LearningAreasContent
  engagementPlansContent: EngagementPlansContent
  selectedLearningArea: LearningArea | null
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
  update,
  view
}

export default display