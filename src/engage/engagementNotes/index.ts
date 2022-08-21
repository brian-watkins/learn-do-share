export enum NoteState {
  "Retrieved",
  "Deleting"
}

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
