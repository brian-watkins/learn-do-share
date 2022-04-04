import { LearningAreasContent, learningAreasView, LearningAreaOpened, LearningArea, learningAreasLoading, learningAreasLoaded } from "./learningAreas"
import { learningAreasRequested, LearningAreasResponse } from "./requestLearningAreas"
import * as Html from "../display/markup"
import { loadingIndicatorView } from "./loadingIndicatorView"
import { DataMessage } from "./backstage"
import { backstageMessage, BackstageMessage } from "../display/backstage"
import { Display } from "../display/display"
import { EffectHandler } from "../display/effect"
import { EngagementPlansContent, EngagementPlansLoaded, engagementPlansLoading, engagementPlansRequested } from "./readEngagementPlans"
import { EngagementPlanPersisted, writeEngagementPlan } from "./writeEngagementPlans"

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

interface ApplicationStart {
  type: "onApplicationStart"
}

type DisplayMessage
  = LearningAreasResponse
  | LearningAreaOpened
  | EngagementPlanPersisted
  | EngagementPlansLoaded
  | ApplicationStart

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

const actions: { [key: string]: EffectHandler } = {
  engagementPlanSelected(dispatcher, message) {
    dispatcher(backstageMessage(writeEngagementPlan(message.plan)))
  },
  onApplicationStart(dispatcher) {
    dispatcher(backstageMessage(learningAreasRequested()))
    dispatcher(backstageMessage(engagementPlansRequested()))
  }
}

function initialCommand(): DisplayMessage {
  return { type: "onApplicationStart" }
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
  view,
  actions
}

export default display