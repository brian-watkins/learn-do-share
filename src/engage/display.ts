import * as Html from "@/display/markup"
import { DisplayConfig } from "@/display/display"
import { LearningArea, learningAreaCategoryView, learningAreaTitleView } from "./learningArea"
import { User } from "@/api/common/user"
import { learningAreaContentView } from "./learningAreaContent"
import { footer, header, linkBox } from "../viewElements"
import { userAccountView } from "../user"
import { view as engagementNotesView } from "./engagementNotes/view"
import { view as engagementPlansView } from "./engagementPlans/view"
import { EngagementNotes, engagementNotesRetrieved } from "./engagementNotes"
import { EngagementLevels, engagementLevelsRetrieved } from "./engagementPlans"
import { deleteNote } from "./engagementNotes/deleteNote"
import { saveNote } from "./engagementNotes/saveNote"
import { saveEngagementPlan } from "./engagementPlans/saveEngagementPlan"
import { deleteEngagementPlansProcedure } from "./engagementPlans/deleteEngagementPlans"
import { LearningAreaCategory } from "../overview/learningAreaCategory"
import { mapAll } from "../util/procedures"

export interface Informative {
  type: "informative"
  learningArea: LearningArea
}

export interface Personalized {
  type: "personalized"
  learningArea: LearningArea
  engagementLevels: EngagementLevels
  engagementNotes: EngagementNotes
  user: User
}

export interface Error {
  type: "error"
  learningArea: LearningArea
  engagementLevels: EngagementLevels
  engagementNotes: EngagementNotes
  user: User
}

export type Model
  = Informative
  | Personalized
  | Error

// View

function view(model: Model): Html.View {
  switch (model.type) {
    case "informative":
      return page([
        pageHeader([
          learningAreasLink(),
          loginView(model.learningArea)
        ]),
        learningAreaCategoryView(model.learningArea),
        learningAreaTitleView(model.learningArea),
        learningAreaContentView(model.learningArea)
      ])
    case "personalized":
      return Html.div([], [
        personalizedEngagePage(model)
      ])
    case "error":
      return Html.div([], [
        pageError(),
        personalizedEngagePage(model)
      ])
  }
}

function personalizedEngagePage(model: Personalized | Error): Html.View {
  return page([
    pageHeader([
      learningAreasLink(),
      userAccountView(model.user)
    ]),
    learningAreaCategoryView(model.learningArea),
    learningAreaTitleView(model.learningArea),
    contentArea([
      learningAreaContentView(model.learningArea),
      contentColumn([
        engagementPlansView(model.learningArea, model.engagementLevels),
        engagementNotesView(model.learningArea, model.engagementNotes)
      ])
    ])
  ])
}

function pageError(): Html.View {
  return Html.div([
    Html.data("error"),
    Html.cssClasses([
      "bg-green-100",
      "h-screen",
      "w-screen",
      "flex",
      "justify-center",
      "items-center",
      "gap-16",
      "fixed",
      "animate-slidein",
      "opacity-90"
    ])
  ], [
    errorText(),
    errorText(),
    errorText(),
    errorText(),
  ])
}

function errorText(): Html.View {
  return Html.p([
    Html.cssClasses([
      "text-center",
      "text-2xl",
      "font-bold",
      "uppercase"
    ])
  ], [
    Html.text("Error")
  ])
}

function pageHeader(views: Array<Html.View>): Html.View {
  return header([], views)
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
        "mt-24"
      ])
    ])
  ])
}

function contentArea(views: Array<Html.View>): Html.View {
  return Html.div([
    Html.cssClasses([
      "flex",
      "gap-32",
      "grow"
    ])
  ], views)
}

function contentColumn(views: Array<Html.View>): Html.View {
  return Html.div([
    Html.cssClasses([
      "mt-12",
      "flex",
      "flex-col",
      "gap-4"
    ])
  ], views)
}

export function loginView(area: LearningArea): Html.View {
  return linkBox(`/login?redirect=/learning-areas/${area.id}`, "Login")
}

function learningAreasLink(): Html.View {
  return linkBox("/", "All Learning Areas")
}

function toPersonalized(model: Model): Personalized | Error {
  if (model.type === "personalized" || model.type === "error") {
    return model
  } else {
    return {
      type: "error",
      learningArea: { id: "", title: "", content: "", category: LearningAreaCategory.Discipline },
      engagementLevels: engagementLevelsRetrieved([]),
      engagementNotes: engagementNotesRetrieved([]),
      user: { identifier: "", name: "" }
    }
  }
}

const display: DisplayConfig<Model> = {
  view,
  procedures: mapAll(toPersonalized, [
    saveNote,
    deleteNote,
    saveEngagementPlan,
    deleteEngagementPlansProcedure
  ])
}

export default display