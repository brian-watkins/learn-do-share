import * as Html from "loop/display"
import { Colors, focusWithinBorderColor, mediumTextColor, textColor } from "../../style.js"
import { format, parseISO } from "date-fns"
import { createNote, deleteNote, EngagementNote, engagementNotes } from "./index.js"
import { container, meta, ok, state, State, useProvider, withInitialValue, writeMessage } from "loop"
import { headingBox } from "../../viewElements.js"


export default Html.withState({ activationId: "engagement-notes" }, (get) => {
  const notes = get(engagementNotes)

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
    Html.withState(noteInputView),
    ...notes.map(engagementNoteView)
  ])
})

const noteText = container(withInitialValue(""))

useProvider({
  provide: (get, set) => {
    get(engagementNotes)
    set(meta(noteText), ok(""))
  }
})

const isSavingNote = state(get => {
  return get(meta(engagementNotes)).type === "pending"
})

function noteInputView(get: <S>(state: State<S>) => S): Html.View {
  const noteContent = get(noteText)
  const isSaving = get(isSavingNote)

  return Html.div([
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
        ...(noteContent.length === 0 ? [Html.property("value", noteContent)] : []),
        Html.onInput((value: string) => writeMessage(noteText, value)),
        Html.disabled(isSaving),
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
      Html.onClick(writeMessage(engagementNotes, createNote(noteContent))),
      Html.disabled(noteContent.length == 0 || isSaving)
    ], [
      Html.text("Save Note")
    ])
  ])
}

const deletingNote = state(get => {
  const notesStatus = get(meta(engagementNotes))
  if (notesStatus.type === "pending" && notesStatus.message.type === "delete-note") {
    return notesStatus.message.note
  } else {
    return undefined
  }
})

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
      // Not sure if this is a good idea to have a
      // inline function here for withState. Each time this is run
      // it will generate a new state
      Html.withState(get => Html.button([
        Html.cssClasses([
          "w-fit",
          "text-slate-300",
          "font-bold",
          "hover:text-sky-600",
          "hover:underline",
        ]),
        Html.onClick(writeMessage(engagementNotes, deleteNote(note))),
        Html.disabled(get(deletingNote)?.id === note.id)
      ], [
        Html.text("Delete Note")
      ]))
    ]),
    Html.div([
      Html.cssClasses([
        "pb-4"
      ]),
      Html.property("innerHTML", note.content)
    ], [])
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
