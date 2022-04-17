import { learningAreasView, LearningAreaOpened, LearningArea, learningAreaView } from "./learningAreas"
import * as Html from "../display/markup"
import { DataMessage } from "./backstage"
import { BackstageMessage } from "../display/backstage"
import { Display } from "../display/display"
import { EngagementPlanPersisted } from "./writeEngagementPlans"
import { loginView, User, userAccountView } from "./user"
import { PersonalizedLearningArea, personalizedLearningAreaView } from "./personalizedLearningAreas"
import { asListItem } from "./viewHelpers"

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
        case "engagementPlanPersisted":
          const index = state.learningAreas.findIndex(area => {
            return area.id === action.plan.learningArea
          })
          state.learningAreas[index].engagementLevels.push(action.plan.level)
          break
      }
  }
}

// View

function view(appState: AppState): Html.View {
  switch (appState.type) {
    case "informative":
      return Html.div([], [
        loginView(),
        learningAreasView(appState.learningAreas.map(learningAreaView).map(asListItem))
      ])
    case "personalized":
      return Html.div([], [
        userAccountView(appState.user),
        learningAreasView(appState.learningAreas.map(personalizedLearningAreaView).map(asListItem))
      ])
  }
}


const display: Display<AppState, DisplayMessage | BackstageMessage<DataMessage>> = {
  update,
  view
}

export default display