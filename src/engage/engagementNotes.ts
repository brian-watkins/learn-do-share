import { BackstageMessage, backstageMessage } from "@/display/backstage"
import { batch } from "@/display/batch"
import * as Html from "@/display/markup"
import { borderColor, Colors, link } from "../style"
import { headingBox } from "../viewElements"
import { EngagementNote, PersonalizedLearningArea } from "./personalizedLearningArea"


export interface EngagementNoteContents {
  content: string
}

export function engagementNotesView(area: PersonalizedLearningArea): Html.View {
  return Html.div([
    Html.id("engagement-notes"),
    Html.cssClasses([
      "mt-8",
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
    return Html.div([
      Html.cssClasses([
        "flex",
        "flex-col",
        "mb-8",
        "gap-4"
      ])
    ], [
      headingBox("Notes"),
      Html.textarea([
        Html.data("note-input"),
        Html.value(state),
        Html.onInput(setState),
        noteBox(),
        Html.cssClasses([
          "focus:outline-none",
          "resize-none"
        ])
      ], []),
      Html.button([
        link(),
        Html.cssClasses([
          "w-fit",
          "self-end"
        ]),
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
    noteBox(),
    Html.cssClasses([
      "mb-8",
    ])
  ], [
    Html.text(note.content)
  ])
}

function noteBox(): Html.ViewAttribute {
  return Html.cssClasses([
    "text-lg",
    "py-4",
    "px-6",
    "rounded",
    "border-2",
    "border-solid",
    borderColor(Colors.Dark),
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
