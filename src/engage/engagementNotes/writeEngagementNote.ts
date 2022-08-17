import { LearningArea } from "../learningArea"
import { EngagementNote, EngagementNoteContents } from "."

export type EngagementNoteMessages
  = EngagementNoteCreationRequested
  | EngagementNotePersisted
  | EngagementNoteDeleteRequested
  | EngagementNoteDeleted

export interface EngagementNoteCreationRequested {
  type: "engagementNoteCreationRequested"
  learningAreaId: string
  contents: EngagementNoteContents
}

export function createNoteMessage(area: LearningArea, content: string): EngagementNoteCreationRequested {
  return {
    type: "engagementNoteCreationRequested",
    learningAreaId: area.id,
    contents: {
      content,
      date: new Date().toISOString()
    }
  }
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

export interface EngagementNoteDeleteRequested {
  type: "engagementNoteDeleteRequested"
  note: EngagementNote
}

export function deleteNoteMessage(note: EngagementNote): EngagementNoteDeleteRequested {
  return {
    type: "engagementNoteDeleteRequested",
    note
  }
}

export interface EngagementNoteDeleted {
  type: "engagementNoteDeleted",
  note: EngagementNote
}

export function engagementNoteDeleted(note: EngagementNote): EngagementNoteDeleted {
  return {
    type: "engagementNoteDeleted",
    note
  }
}