import * as Html from "@/display/markup"
import { DisplayConfig } from "@/display/display"
import { LearningArea, learningAreaCategoryView, learningAreaTitleView } from "./learningArea"
import { User } from "@/api/common/user"
import { learningAreaContentView } from "./learningAreaContent"
import { header, linkBox } from "../viewElements"
import { userAccountView } from "../user"
import { view as engagementNotesView } from "./engagementNotes/view"
import { EngagementNoteMessages } from "./engagementNotes/writeEngagementNote"
import { view as engagementPlansView } from "./engagementPlans/view"
import { EngagementPlanMessages, engagementPlanWriteInProgress } from "./engagementPlans/writeEngagementPlans"
import { EngagementNote } from "./engagementNotes"
import { EngagementLevels, engagementLevelsRetrieved, engagementLevelsSaving } from "./engagementPlans"
import { sendBackstage } from "@/api/backstage/adapter"

export interface Informative {
  type: "informative"
  learningArea: LearningArea
}

export interface Personalized {
  type: "personalized"
  learningArea: LearningArea
  engagementLevels: EngagementLevels
  engagementNotes: Array<EngagementNote>
  user: User
}

export type Model
  = Informative
  | Personalized


// View

function view(model: Model): Html.View {
  switch (model.type) {
    case "informative":
      return Html.article([], [
        pageHeader([
          learningAreasLink(),
          loginView(model.learningArea)
        ]),
        learningAreaCategoryView(model.learningArea),
        learningAreaTitleView(model.learningArea),
        learningAreaContentView(model.learningArea),
      ])
    case "personalized":
      return Html.article([], [
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
}

function pageHeader(views: Array<Html.View>): Html.View {
  return header([], views)
}

function contentArea(views: Array<Html.View>): Html.View {
  return Html.div([
    Html.cssClasses([
      "flex",
      "gap-32"
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

type Messages = EngagementNoteMessages | EngagementPlanMessages

const display: DisplayConfig<Model, Messages> = {
  view,
  update: (model, message) => {
    if (model.type === "informative") {
      return
    }

    switch (message.type) {
      case "engagementPlanWriteInProgress":
        model.engagementLevels = engagementLevelsSaving(model.engagementLevels.levels)
        break
      case "engagementPlanPersisted":
        const levels = model.engagementLevels.levels
        levels.push(message.plan.level)
        model.engagementLevels = engagementLevelsRetrieved(levels)
        break
      case "engagementPlansDeleted":
        model.engagementLevels = engagementLevelsRetrieved([])
        break
      case "engagementNotePersisted":
        model.engagementNotes.unshift(message.note)
        break
      case "engagementNoteDeleted":
        model.engagementNotes = model.engagementNotes.filter(note => note.id !== message.note.id)
        break
    }
  },
  process: (dispatch, state, message) => {
    switch (message.type) {
      case "writeEngagementPlan":
        sendBackstage(dispatch, state, message)
        dispatch(engagementPlanWriteInProgress())
        break
      case "deleteEngagementPlans":
      case "engagementNoteCreationRequested":
      case "engagementNoteDeleteRequested":
        sendBackstage(dispatch, state, message)
        break
    }
  }
}

export default display