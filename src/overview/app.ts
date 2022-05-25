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
  return Html.h3([Html.id("learning-area-title"), Html.cssClasses([
    "font-bold",
    "text-sky-800",
    "text-8xl",
    "mb-8",
    "mx-16"
  ])], [
    Html.text("Principles and Practices"),
  ])
}

export function learningAreasPracticeView(): Html.ViewChild {
  return Html.div([Html.id("learning-area-practice"), Html.cssClasses([
    "capitalize",
    "py-2",
    "px-4",
    "my-4",
    "mx-16",
    "bg-sky-800",
    "rounded",
    "text-neutral-50",
    "border-2",
    "border-sky-800",
    "capitalize",
    "font-bold"
  ])], [
    Html.text("Engineering")
  ])
}


const display: DisplayConfig<AppModel, never | BackstageMessage<never>> = {
  update: () => {},
  view
}

export default display