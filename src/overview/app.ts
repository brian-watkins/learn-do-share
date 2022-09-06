import { learningAreasView, LearningArea, learningAreaView } from "./learningAreas"
import * as Html from "@/display/markup"
import * as Style from "../style"
import { DisplayConfig } from "@/display/display"
import { userAccountView } from "../user"
import { PersonalizedLearningArea, personalizedLearningAreaView } from "./personalizedLearningAreas"
import { User } from "@/api/common/user"
import { footer, header, linkBox, pageTitle } from "../viewElements"
import { EngagementLevel } from "../engage/engagementPlans"

export interface Informative {
  type: "informative"
}

export interface Personalized {
  type: "personalized"
  engagementLevels: { [key:string]: Array<EngagementLevel> }
  engagementNoteCounts: { [key:string]: number }
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
      return page([
        pageHeader([
          loginView()
        ]),
        learningAreasPracticeView(),
        learningAreasTitleView(),
        learningAreasView(model.learningAreas, learningAreaView)
      ])
    case "personalized":
      return page([
        pageHeader([
          userAccountView(model.state.user)
        ]),
        learningAreasPracticeView(),
        learningAreasTitleView(),
        learningAreasView(model.learningAreas, forPersonalized(model.state, personalizedLearningAreaView)) 
      ])
  }
}

function forPersonalized(model: Personalized, generator: (personalized: PersonalizedLearningArea) => Html.View): (learningArea: LearningArea) => Html.View {
  return (learningArea: LearningArea) => {
    const personalizedLearningArea = {
      ...learningArea,
      engagementLevels: model.engagementLevels[learningArea.id] ?? [],
      engagementNoteCount: model.engagementNoteCounts[learningArea.id] ?? 0
    }

    return generator(personalizedLearningArea)
  }
}

function pageHeader(views: Array<Html.View>): Html.View {
  return header([Html.cssClasses(["flex-row-reverse"])], views)
}

function page(views: Array<Html.View>): Html.View {
  return Html.article([
    Html.cssClasses([
      "flex-col",
      "flex",
      "min-h-screen"
    ])
  ], [
    ...views,
    footer([
      Html.cssClasses([
        "mt-16"
      ])
    ])
  ])
}

export function loginView(): Html.View {
  return linkBox("/login", "Login")
}

export function learningAreasTitleView(): Html.View {
  return pageTitle([Html.id("learning-area-title")], "Principles and Practices")
}

export function learningAreasPracticeView(): Html.View {
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
  view
}

export default display