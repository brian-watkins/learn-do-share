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
  return Html.h3([Html.id("learning-area-title"), Html.cssClassList([
    { "font-bold": true },
    { "text-sky-800": true },
    { "text-8xl": true },
    { "mb-8": true },
    { "mx-16": true }
  ])], [
    Html.text("Principles and Practices"),
  ])
}

export function learningAreasPracticeView(): Html.ViewChild {
  return Html.div([Html.id("learning-area-practice"), Html.cssClassList([
    { "capitalize": true },
    { "py-2": true },
    { "px-4": true },
    { "my-4": true },
    { "mx-16": true },
    { "bg-sky-800": true },
    { "rounded": true },
    { "text-neutral-50": true },
    { "border-2": true },
    { "border-sky-800": true },
    { "capitalize": true },
    { "font-bold": true }
  ])], [
    Html.text("Engineering")
  ])
}


const display: DisplayConfig<AppModel, never | BackstageMessage<never>> = {
  update: () => {},
  view
}

export default display