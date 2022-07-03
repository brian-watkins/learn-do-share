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
    Html.id("engagement-notes")
  ], notes.map(engagementNoteView))
}

function engagementNoteView(note: EngagementNote): Html.View {
  return Html.div([
    Html.data("engagement-note")
  ], [
    Html.text(note.content)
  ])
}