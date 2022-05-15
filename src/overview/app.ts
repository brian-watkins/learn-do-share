import { learningAreasView, LearningArea, learningAreaView } from "./learningAreas"
import * as Html from "@/display/markup"
import { BackstageMessage } from "@/display/backstage"
import { DisplayConfig } from "@/display/display"
import { loginView, userAccountView } from "../user"
import { personalizedLearningAreaView } from "./personalizedLearningAreas"
import { User } from "@/api/common/user"
import { EngagementLevel } from "../engage/engagementPlans"

export interface Informative {
  type: "informative"
}

export interface Personalized {
  type: "personalized"
  engagementLevels: { [key:string]: Array<EngagementLevel> }
  user: User
}

export interface AppModel {
  learningAreas: Array<LearningArea>
  state: AppState
}

export type AppState
  = Informative
  | Personalized

// View

function view(model: AppModel): Html.View {
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


const display: DisplayConfig<AppModel, never | BackstageMessage<never>> = {
  update: () => {},
  view
}

export default display