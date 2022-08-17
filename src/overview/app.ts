import { learningAreasView, LearningArea, learningAreaView } from "./learningAreas"
import * as Html from "@/display/markup"
import * as Style from "../style"
import { DisplayConfig } from "@/display/display"
import { userAccountView } from "../user"
import { personalizedLearningAreaView } from "./personalizedLearningAreas"
import { User } from "@/api/common/user"
import { header, linkBox, pageTitle } from "../viewElements"
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
        pageHeader([
          loginView()
        ]),
        learningAreasPracticeView(),
        learningAreasTitleView(),
        learningAreasView(model.learningAreas, learningAreaView)
      ])
    case "personalized":
      return Html.div([], [
        pageHeader([
          userAccountView(model.state.user)
        ]),
        learningAreasPracticeView(),
        learningAreasTitleView(),
        learningAreasView(model.learningAreas, personalizedLearningAreaView(model.state.engagementLevels)) 
      ])
  }
}

function pageHeader(views: Array<Html.View>): Html.View {
  return header([Html.cssClasses(["flex-row-reverse"])], views)
}

export function loginView(): Html.View {
  return linkBox("/login", "Login")
}

export function learningAreasTitleView(): Html.ViewChild {
  return pageTitle([Html.id("learning-area-title")], "Principles and Practices")
}

export function learningAreasPracticeView(): Html.ViewChild {
  return Html.div([Html.id("learning-area-practice"), Style.tag(Style.Colors.Dark),
  Html.cssClasses([
    "mt-8",
    "mb-4",
    "mx-16",
  ])], [
    Html.text("Engineering")
  ])
}


const display: DisplayConfig<AppModel, never> = {
  view,
  update: () => {},
  process: () => {}
}

export default display