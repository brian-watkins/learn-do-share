import { BackstageMessage, backstageMessage } from "@/display/backstage"
import { batch } from "@/display/batch"
import * as Html from "@/display/markup"
import { Colors, focusWithinBorderColor, mediumTextColor, textColor } from "../style"
import { headingBox } from "../viewElements"
import { EngagementNote, PersonalizedLearningArea } from "./personalizedLearningArea"
import { format, parseISO } from "date-fns"
import * as Display from "@/display/context"

export interface EngagementNoteContents {
  content: string
  date: string
}

export function engagementNotesView(area: PersonalizedLearningArea): Html.View {
  return Html.div([
    Html.id("engagement-notes"),
    Html.cssClasses([
      "mt-8",
      "w-128",
      "flex",
      "flex-col",
      "gap-8"
    ])
  ], [
    headingBox("Notes"),
    noteInputView(area),
    ...area.engagementNotes.map(engagementNoteView)
  ])
}

function noteInputView(area: PersonalizedLearningArea): Html.View {
  return Display.context("", (noteContent, setNoteContent) =>
    Html.div([
      noteBox(),
      Html.cssClasses([
        "flex",
        "flex-col",
        focusWithinBorderColor(Colors.Engagement),
      ])
    ], [
      Html.div([
        Html.cssClasses([
          "grid",
          "after:whitespace-pre-wrap",
          "after:content-[attr(data-replicated-value)]",
          "after:invisible",
          "after:rounded",
          "after:py-4",
          "after:px-6",
          "after:row-start-1",
          "after:col-start-1",
          "after:row-end-2",
          "after:col-end-2",
        ]),
        Html.data("replicated-value", `${noteContent} `)
      ], [
        Html.textarea([
          Html.data("note-input"),
          Html.value(noteContent),
          Html.onInput(setNoteContent),
          Html.cssClasses([
            "focus:outline-none",
            "rounded",
            "resize-none",
            "py-4",
            "px-6",
            "overflow-hidden",
            "row-start-1",
            "col-start-1",
            "row-end-2",
            "col-end-2"
          ])
        ], [])
      ]),
      Html.button([
        Html.cssClasses([
          "w-fit",
          "self-end",
          textColor(Colors.Engagement),
          "disabled:text-slate-300",
          "font-bold",
          "px-4",
          "py-2",
          "disabled:no-underline",
          "hover:underline",
        ]),
        Html.onClick(batch([
          createNoteMessage(area, noteContent),
          setNoteContent(""),
        ])),
        Html.disabled(noteContent.length === 0)
      ], [
        Html.text("Save Note")
      ])
    ])
  )
}

function engagementNoteView(note: EngagementNote): Html.View {
  return Html.div([
    Html.data("engagement-note"),
    noteBox(),
    Html.cssClasses([
      "px-6",
    ])
  ], [
    Html.div([
      Html.cssClasses([
        "pt-4",
        "pb-2",
        "text-sm",
        mediumTextColor
      ])
    ], [
      Html.text(formattedNoteDate(note.date))
    ]),
    Html.div([
      Html.cssClasses([
        "pb-4"
      ])
    ], [
      Html.text(note.content)
    ])
  ])
}

function formattedNoteDate(isoDate: string): string {
  return format(parseISO(isoDate), "MMMM d, yyyy")
}

function noteBox(): Html.ViewAttribute {
  return Html.cssClasses([
    "text-lg",
    "rounded",
    "border-2",
    "border-solid",
    "border-slate-200"
  ])
}

export interface EngagementNoteCreationRequested {
  type: "engagementNoteCreationRequested"
  learningAreaId: string
  contents: EngagementNoteContents
}

function createNoteMessage(area: PersonalizedLearningArea, content: string): BackstageMessage<EngagementNoteCreationRequested> {
  return backstageMessage({
    type: "engagementNoteCreationRequested",
    learningAreaId: area.id,
    contents: {
      content,
      date: new Date().toISOString()
    }
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
