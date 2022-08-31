import { batch } from "@/display/batch"
import * as Html from "@/display/markup"
import { Colors, focusWithinBorderColor, mediumTextColor, textColor } from "../../style"
import { headingBox } from "../../viewElements"
import { format, parseISO } from "date-fns"
import * as Display from "@/display/context"
import { decorate, TagDecorator } from "../../util/markdownParser"
import { LearningArea } from "../learningArea"
import { EngagementNote, EngagementNotes, NoteState } from "."
import { createNoteMessage, deleteNoteMessage } from "./writeEngagementNote"


export function view(area: LearningArea, engagementNotes: EngagementNotes): Html.View {
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
    noteInputView(area, engagementNotes),
    ...engagementNotes.notes.map(engagementNoteView)
  ])
}

function noteInputView(area: LearningArea, engagementNotes: EngagementNotes): Html.View {
  return Display.context({ initialState: "", key: `${engagementNotes.notes.length}` }, (noteContent, setNoteContent) =>
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
          Html.disabled(isSavingNotes(engagementNotes)),
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
            "col-end-2",
            "disabled:text-slate-300"
          ]),
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
        ])),
        Html.disabled(noteContent.length == 0 || isSavingNotes(engagementNotes))
      ], [
        Html.text("Save Note")
      ])
    ])
  )
}

function isSavingNotes(engagementNotes: EngagementNotes): boolean {
  return engagementNotes.type === "engagement-note-saving"
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
        "flex",
        "justify-between",
        mediumTextColor
      ])
    ], [
      Html.text(formattedNoteDate(note.date)),
      Html.div([
        displaysAsAnError(whenNoteDeleteFailed(note))
      ], [
        Html.text("Delete failed!")
      ]),
      Html.button([
        Html.cssClasses([
          "w-fit",
          "text-slate-300",
          "font-bold",
          "hover:text-sky-600",
          "hover:underline",
        ]),
        Html.onClick(deleteNoteMessage(note)),
        Html.disabled(whenDeletingNote(note))
      ], [
        Html.text("Delete Note")
      ])
    ]),
    Html.div([
      Html.cssClasses([
        "pb-4"
      ]),
      Html.withHTMLContent(note.content)
    ], [])
  ])
}

function whenNoteDeleteFailed(note: EngagementNote): boolean {
  return note.state === NoteState.FailedDeleting
}

function whenDeletingNote(note: EngagementNote): boolean {
  return note.state === NoteState.Deleting
}

export function noteContentTagStyles(): Array<TagDecorator> {
  return [
    decorate("a", { classname: "text-sky-800 underline visited:text-sky-600", rel: "external", target: "_blank" }),
    decorate("h1", { classname: "font-bold text-2xl" }),
    decorate("h3", { classname: "font-bold" }),
    decorate("ul", { classname: "list-disc list-inside" }),
    decorate("p", { classname: "pb-4" })
  ]
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

function displaysAsAnError(errorIsVisible:boolean) {
  return Html.cssClasses(
    errorIsVisible ? [
    "text-red-500"
  ] : [
    "hidden"
  ])
}