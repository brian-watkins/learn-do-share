import { learningAreasView, LearningAreaOpened, LearningArea, learningAreaView } from "./learningAreas"
import * as Html from "../display/markup"
import { DataMessage } from "./backstage"
import { BackstageMessage } from "../display/backstage"
import { Display } from "../display/display"
import { EngagementPlanPersisted, EngagementPlansDeleted } from "./writeEngagementPlans"
import { loginView, userAccountView } from "./user"
import { PersonalizedLearningArea, personalizedLearningAreaView } from "./personalizedLearningAreas"
import { User } from "../api/common/user"

export interface Informative {
  type: "informative"
  learningAreas: Array<LearningArea>
}

export interface Personalized {
  type: "personalized"
  learningAreas: Array<PersonalizedLearningArea>
  user: User
}

export type AppState
  = Informative
  | Personalized

type DisplayMessage
  = LearningAreaOpened
  | EngagementPlanPersisted
  | EngagementPlansDeleted

function update(state: AppState, action: DisplayMessage): void {
  switch (state.type) {
    case "informative":
      switch (action.type) {
        case "learningAreaOpened":
          state.learningAreas.forEach(area => area.selected = (area.id === action.area.id))
          break
      }
      break

    case "personalized":
      switch (action.type) {
        case "learningAreaOpened":
          state.learningAreas.forEach(area => area.selected = (area.id === action.area.id))
          break
        case "engagementPlanPersisted": {
          const index = state.learningAreas.findIndex(area => {
            return area.id === action.plan.learningArea
          })
          state.learningAreas[index].engagementLevels.push(action.plan.level)
          break
        }
        case "engagementPlansDeleted": {
          const index = state.learningAreas.findIndex(area => {
            return area.id === action.learningArea
          })
          state.learningAreas[index].engagementLevels = []
          break
        }
      }
  }
}

// View

function view(appState: AppState): Html.View {
  console.log("Drawing main view with state:", appState)
  switch (appState.type) {
    case "informative":
      return Html.div([], [
        loginView(),
        learningAreasView(appState.learningAreas, learningAreaView)
      ])
    case "personalized":
      return Html.div([], [
        userAccountView(appState.user),
        learningAreasView(appState.learningAreas, personalizedLearningAreaView) 
      ])
  }
}


const display: Display<AppState, DisplayMessage | BackstageMessage<DataMessage>> = {
  update,
  view
}

export default display