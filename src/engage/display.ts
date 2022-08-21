import * as Html from "@/display/markup"
import { DisplayConfig } from "@/display/display"
import { LearningArea, learningAreaCategoryView, learningAreaTitleView } from "./learningArea"
import { User } from "@/api/common/user"
import { learningAreaContentView } from "./learningAreaContent"
import { header, linkBox } from "../viewElements"
import { userAccountView } from "../user"
import { view as engagementNotesView } from "./engagementNotes/view"
import { engagementNoteDeleteInProgress, EngagementNoteMessages } from "./engagementNotes/writeEngagementNote"
import { view as engagementPlansView } from "./engagementPlans/view"
import { EngagementPlanMessages, engagementPlanPersisted, engagementPlanWriteFailed, engagementPlanWriteInProgress } from "./engagementPlans/writeEngagementPlans"
import { EngagementNote, NoteState } from "./engagementNotes"
import { EngagementLevels, engagementLevelsRetrieved, engagementLevelsSaving, EngagementPlan } from "./engagementPlans"
import { BackstageError, getBackstageResult, sendBackstage } from "@/api/backstage/adapter"
import { MessageDispatcher, MessageForwarder } from "@/display/effect"
import { Result } from "../util/result"

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

async function process(forward: MessageForwarder, dispatch: MessageDispatcher, _: Model, message: Messages) {
  switch (message.type) {
    case "writeEngagementPlan":
      dispatch(engagementPlanWriteInProgress())
      const result: Result<EngagementPlan, BackstageError> = await getBackstageResult(message)
      dispatch(result.resolve({
        ok: engagementPlanPersisted,
        error: () => engagementPlanWriteFailed(message.plan)
      }))
      break
    case "engagementNoteDeleteRequested":
      dispatch(engagementNoteDeleteInProgress(message.note))
      dispatch(await sendBackstage(message))
      break
    case "deleteEngagementPlans":
    case "engagementNoteCreationRequested":
      const nextMessage = await sendBackstage(message)
      dispatch(nextMessage)
      break
    default:
      forward()
  }
}

function update(model: Personalized, message: Messages) {
  switch (message.type) {
    case "engagementPlanWriteInProgress":
      model.engagementLevels = engagementLevelsSaving(model.engagementLevels.levels)
      break
    case "engagementPlanPersisted":
      const levels = model.engagementLevels.levels
      levels.push(message.plan.level)
      model.engagementLevels = engagementLevelsRetrieved(levels)
      break
    case "engagementPlanWriteFailed":
      model.engagementLevels = engagementLevelsRetrieved(model.engagementLevels.levels)
      break
    case "engagementPlansDeleted":
      model.engagementLevels = engagementLevelsRetrieved([])
      break
    case "engagementNotePersisted":
      model.engagementNotes.unshift(message.note)
      break
    case "engagementNoteDeleteInProgress":
      const note = model.engagementNotes.filter(note => note.id === message.note.id)[0]
      note.state = NoteState.Deleting
      break
    case "engagementNoteDeleted":
      model.engagementNotes = model.engagementNotes.filter(note => note.id !== message.note.id)
      break
  }
}

function onlyPersonalized(update: (model: Personalized, message: Messages) => void): (model: Model, message: Messages) => void {
  return (model, message) => {
    if (model.type === "informative") {
      return
    }

    update(model, message)
  }
}

const display: DisplayConfig<Model, Messages> = {
  view,
  update: onlyPersonalized(update),
  process
}

export default display