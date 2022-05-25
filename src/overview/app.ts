import { learningAreasView, LearningArea, learningAreaView } from "./learningAreas"
import * as Html from "@/display/markup"
import * as Style from "../style"
import { BackstageMessage } from "@/display/backstage"
import { DisplayConfig } from "@/display/display"
import { loginView, userAccountView } from "../user"
import { personalizedLearningAreaView } from "./personalizedLearningAreas"
import { User } from "@/api/common/user"
import { EngagementLevel } from "../engage/engagementPlans"
import { pageTitle } from "../viewElements"

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
        learningAreasPracticeView(),
        learningAreasTitleView(),
        learningAreasView(model.learningAreas, learningAreaView)
      ])
    case "personalized":
      return Html.div([], [
        userAccountView(model.state.user),
        learningAreasPracticeView(),
        learningAreasTitleView(),
        learningAreasView(model.learningAreas, personalizedLearningAreaView(model.state.engagementLevels)) 
      ])
  }
}

export function learningAreasTitleView(): Html.ViewChild {
  return pageTitle([Html.id("learning-area-title")], "Principles and Practices")
}

export function learningAreasPracticeView(): Html.ViewChild {
  return Html.div([Html.id("learning-area-practice"), Style.tag(Style.Colors.Standard), 
  Html.cssClasses([
    "my-4",
    "mx-16",
  ])], [
    Html.text("Engineering")
  ])
}


const display: DisplayConfig<AppModel, never | BackstageMessage<never>> = {
  update: () => {},
  view
}

export default display