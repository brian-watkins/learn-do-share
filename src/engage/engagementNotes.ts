import { BackstageMessage, backstageMessage } from "@/display/backstage"
import { batch } from "@/display/batch"
import * as Html from "@/display/markup"
import { EngagementNote, PersonalizedLearningArea } from "./personalizedLearningArea"


export interface EngagementNoteContents {
  content: string
}

export function engagementNotesView(area: PersonalizedLearningArea): Html.View {
  return Html.div([
    Html.id("engagement-notes"),
    Html.cssClasses([
      "w-128",
    ])
  ], [
    noteInputView(area),
    ...area.engagementNotes.map(engagementNoteView)
  ])
}

const inputViewContext = Html.context("")

function noteInputView(area: PersonalizedLearningArea): Html.View {
  return inputViewContext((state, setState) => {
    return Html.div([], [
      Html.input([
        Html.data("note-input"),
        Html.value(state),
        Html.onInput(setState)
      ], []),
      Html.button([
        Html.onClick(batch([
          createNoteMessage(area, state),
          setState(""),
        ]))
      ], [
        Html.text("Save Note")
      ])
    ])
  })
}

function engagementNoteView(note: EngagementNote): Html.View {
  return Html.div([
    Html.data("engagement-note"),
    Html.cssClasses([
      "text-lg",
      "pb-4",
      "mb-8",
      "border-b-2",
      "border-solid",
      "border-cyan-500",
    ])
  ], [
    Html.text(note.content)
  ])
}

export interface EngagementNoteCreationRequested {
  type: "engagementNoteCreationRequested"
  learningAreaId: string
  content: string
}

function createNoteMessage(area: PersonalizedLearningArea, content: string): BackstageMessage<EngagementNoteCreationRequested> {
  return backstageMessage({
    type: "engagementNoteCreationRequested",
    learningAreaId: area.id,
    content
  })
}

export interface EngagementNotePersisted {
  type: "engagementNotePersisted",
  note: EngagementNote
}

export function engagementNotePersisted(note: EngagementNote): EngagementNotePersisted {
  return {
    type: "engagementNotePersisted",
    note
  }
}
