import * as Html from "@/display/markup"

export interface EngagementNote {
  id: string
  content: string
}

export interface EngagementNoteContents {
  content: string
}

export function engagementNotesView(notes: Array<EngagementNote>): Html.View {
  return Html.div([
    Html.id("engagement-notes"),
    Html.cssClasses([
      "w-128",
    ])
  ], notes.map(engagementNoteView))
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