export enum NoteState {
  "Retrieved",
  "Deleting"
}

export interface EngagementNoteSaving {
  type: "engagement-note-saving"
  notes: Array<EngagementNote>
}

export function engagementNoteSaving(notes: Array<EngagementNote>): EngagementNoteSaving {
  return {
    type: "engagement-note-saving",
    notes
  }
}

export interface EngagementNotesRetrieved {
  type: "engagement-notes-retrieved"
  notes: Array<EngagementNote>
}

export function engagementNotesRetrieved(notes: Array<EngagementNote>): EngagementNotesRetrieved {
  return {
    type: "engagement-notes-retrieved",
    notes
  }
}

export type EngagementNotes = EngagementNoteSaving | EngagementNotesRetrieved

export interface EngagementNote {
  state: NoteState
  id: string
  content: string,
  date: string
}

export interface EngagementNoteContents {
  content: string
  date: string
}
