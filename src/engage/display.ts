import * as Html from "@/display/markup"
import { DisplayConfig } from "@/display/display"
import { LearningArea, learningAreaCategoryView, learningAreaTitleView } from "./learningArea"
import { User } from "@/api/common/user"
import { learningAreaContentView } from "./learningAreaContent"
import { footer, header, linkBox } from "../viewElements"
import { userAccountView } from "../user"
import { view as engagementNotesView } from "./engagementNotes/view"
import { engagementNoteDeleted, engagementNoteDeleteFailed, engagementNoteDeleteInProgress, EngagementNoteMessages, engagementNotePersisted, engagementNoteWriteFailed, engagementNoteWriteInProgress } from "./engagementNotes/writeEngagementNote"
import { view as engagementPlansView } from "./engagementPlans/view"
import { EngagementPlanMessages, engagementPlanPersisted, engagementPlansDeleted, engagementPlanWriteFailed, engagementPlanWriteInProgress } from "./engagementPlans/writeEngagementPlans"
import { EngagementNote, EngagementNotes, engagementNoteSaving, engagementNotesRetrieved, NoteState } from "./engagementNotes"
import { EngagementLevels, engagementLevelsRetrieved, engagementLevelsSaving, EngagementPlan } from "./engagementPlans"
import { BackstageError, getBackstageResult } from "@/api/backstage/adapter"
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
  engagementNotes: EngagementNotes
  user: User
}

export type Model
  = Informative
  | Personalized


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

type Messages = EngagementNoteMessages | EngagementPlanMessages

async function process(forward: MessageForwarder, dispatch: MessageDispatcher, _: Model, message: Messages) {
  switch (message.type) {
    case "writeEngagementPlan": {
      dispatch(engagementPlanWriteInProgress())
      const result: Result<EngagementPlan, BackstageError> = await getBackstageResult(message)
      dispatch(result.resolve({
        ok: engagementPlanPersisted,
        error: () => engagementPlanWriteFailed()
      }))
      break
    }
    case "engagementNoteDeleteRequested": {
      dispatch(engagementNoteDeleteInProgress(message.note))
      const result: Result<EngagementNote, BackstageError> = await getBackstageResult(message)
      dispatch(result.resolve({
        ok: engagementNoteDeleted,
        error: () => engagementNoteDeleteFailed(message.note)
      }))
      break
    }
    case "engagementNoteCreationRequested": {
      dispatch(engagementNoteWriteInProgress(message.contents))
      const result: Result<EngagementNote, BackstageError> = await getBackstageResult(message)
      dispatch(result.resolve({
        ok: engagementNotePersisted,
        error: () => engagementNoteWriteFailed(message.contents)
      }))
      break
    }
    case "deleteEngagementPlans":
      dispatch(engagementPlanWriteInProgress())
      const result: Result<string, BackstageError> = await getBackstageResult(message)
      dispatch(result.resolve({
        ok: engagementPlansDeleted,
        error: () => engagementPlanWriteFailed()
      }))
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
    case "engagementNoteWriteInProgress":
      model.engagementNotes = engagementNoteSaving(model.engagementNotes.notes)
      break
    case "engagementNoteWriteFailed":
      model.engagementNotes = engagementNotesRetrieved(model.engagementNotes.notes)
      break
    case "engagementNotePersisted":
      model.engagementNotes = engagementNotesRetrieved([ message.note, ...model.engagementNotes.notes ])
      break
    case "engagementNoteDeleteInProgress": {
      const note = model.engagementNotes.notes.find(note => note.id === message.note.id)
      if (note) {
        note.state = NoteState.Deleting
      }
      break
    }
    case "engagementNoteDeleteFailed": {
      const note = model.engagementNotes.notes.find(note => note.id === message.note.id)
      if (note) {
        note.state = NoteState.FailedDeleting
      }
      break
    }
    case "engagementNoteDeleted":
      model.engagementNotes.notes = model.engagementNotes.notes.filter(note => note.id !== message.note.id)
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