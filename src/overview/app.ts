import { learningAreasView, LearningArea, learningAreaView } from "./learningAreas.js"
import * as Html from "loop/display"
import * as Style from "../style.js"
import { userAccountView } from "../user.js"
import { PersonalizedLearningArea, personalizedLearningAreaView } from "./personalizedLearningAreas.js"
import { User } from "@/api/common/user.js"
import { footer, header, linkBox, pageTitle } from "../viewElements.js"
import { EngagementLevel } from "../engage/engagementPlans/index.js"

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

export default (model: AppModel) => view(model)