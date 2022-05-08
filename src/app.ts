import { learningAreasView, LearningAreaOpened, LearningArea, learningAreaView } from "./learningAreas"
import * as Html from "../display/markup"
import { DataMessage } from "./backstage"
import { BackstageMessage } from "../display/backstage"
import { DisplayConfig } from "../display/display"
import { EngagementPlanPersisted, EngagementPlansDeleted } from "./writeEngagementPlans"
import { loginView, userAccountView } from "./user"
import { personalizedLearningAreaView } from "./personalizedLearningAreas"
import { User } from "../api/common/user"
import { EngagementLevel } from "./engagementPlans"

export interface Informative {
  type: "informative"
  // learningAreas: Array<LearningArea>
}

export interface Personalized {
  type: "personalized"
  // learningAreas: Array<PersonalizedLearningArea>
  engagementLevels: { [key:string]: Array<EngagementLevel> }
  user: User
}

export interface LearningAreaSelected {
  type: "learning-area-selected",
  learningArea: LearningArea
}

export interface LearningAreaNotFound {
  type: "learning-area-not-found"
}

export interface LearningAreaNotSelected {
  type: "learning-area-not-selected"
}

export type LearningAreaSelection
  = LearningAreaNotSelected
  | LearningAreaNotFound
  | LearningAreaSelected

export interface AppModel {
  learningAreas: Array<LearningArea>
  selectedLearningArea: LearningAreaSelection
  state: AppState
}

export type AppState
  = Informative
  | Personalized

type DisplayMessage
  = LearningAreaOpened
  | EngagementPlanPersisted
  | EngagementPlansDeleted

function update(model: AppModel, action: DisplayMessage): void {
  switch (model.state.type) {
    case "informative":
      break
    case "personalized":
      switch (action.type) {
        case "engagementPlanPersisted":
          const levels = model.state.engagementLevels[action.plan.learningArea]
          if (!levels) {
            model.state.engagementLevels[action.plan.learningArea] = [action.plan.level]
          } else {
            model.state.engagementLevels[action.plan.learningArea] = [...levels, action.plan.level]
          }

          // const index = model.learningAreas.findIndex(area => {
          //   return area.id === action.plan.learningArea
          // })
          // model.learningAreas[index].engagementLevels.push(action.plan.level)
          break
      }
      break
  }
  // switch (model.state.type) {
    // case "informative":
      // switch (action.type) {
        // case "learningAreaOpened":
          // model.learningAreas.forEach(area => area.selected = (area.id === action.area.id))
          // break
      // }
      // break

    // case "personalized":
      // switch (action.type) {
        // case "learningAreaOpened":
          // model.learningAreas.forEach(area => area.selected = (area.id === action.area.id))
          // break
        // case "engagementPlanPersisted": {
          // const index = model.learningAreas.findIndex(area => {
            // return area.id === action.plan.learningArea
          // })
          // model.learningAreas[index].engagementLevels.push(action.plan.level)
          // break
        // }
        // case "engagementPlansDeleted": {
          // const index = model.learningAreas.findIndex(area => {
            // return area.id === action.learningArea
          // })
          // model.learningAreas[index].engagementLevels = []
          // break
        // }
      // }
  // }
}

// View

function view(model: AppModel): Html.View {
  console.log("Drawing main view with state:", model)
  switch (model.state.type) {
    case "informative":
      return Html.div([], [
        loginView(),
        learningAreasView(model.learningAreas, learningAreaView)
      ])
    case "personalized":
      return Html.div([], [
        userAccountView(model.state.user),
        learningAreasView(model.learningAreas, personalizedLearningAreaView(model.state.engagementLevels)) 
      ])
  }
}


const display: DisplayConfig<AppModel, DisplayMessage | BackstageMessage<DataMessage>> = {
  update,
  view
}

export default display