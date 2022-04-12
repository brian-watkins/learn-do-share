import { learningAreasView, LearningAreaOpened, LearningArea } from "./learningAreas"
import * as Html from "../display/markup"
import { DataMessage } from "./backstage"
import { BackstageMessage } from "../display/backstage"
import { Display } from "../display/display"
import { EngagementPlansContent } from "./readEngagementPlans"
import { EngagementPlanPersisted } from "./writeEngagementPlans"

export interface AppState {
  learningAreas: Array<LearningArea>
  engagementPlansContent: EngagementPlansContent
  selectedLearningArea: LearningArea | null
}

type DisplayMessage
  = LearningAreaOpened
  | EngagementPlanPersisted

function update(state: AppState, action: DisplayMessage): void {
  switch (action.type) {
    case "learningAreaOpened":
      state.selectedLearningArea = action.area
      break

    case "engagementPlanPersisted":
      switch (state.engagementPlansContent.type) {
        case "engagementPlansLoaded":
          state.engagementPlansContent.plans.push(action.plan)
      }
      break
  }
}

// View

function view(model: AppState): Html.View {
  return learningAreasView(model.learningAreas, model.selectedLearningArea, model.engagementPlansContent)
}


const display: Display<AppState, DisplayMessage | BackstageMessage<DataMessage>> = {
  update,
  view
}

export default display