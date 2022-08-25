import { LearningArea } from "../learningArea"
import { EngagementNote, EngagementNoteContents } from "."

export type EngagementNoteMessages
  = EngagementNoteCreationRequested
  | EngagementNoteWriteInProgress
  | EngagementNotePersisted
  | EngagementNoteDeleteRequested
  | EngagementNoteDeleteInProgress
  | EngagementNoteDeleteFailed
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

export interface EngagementNoteWriteInProgress {
  type: "engagementNoteWriteInProgress"
  contents: EngagementNoteContents
}

export function engagementNoteWriteInProgress(contents: EngagementNoteContents): EngagementNoteWriteInProgress {
  return {
    type: "engagementNoteWriteInProgress",
    contents
  }
}

export interface EngagementNoteDeleteInProgress {
  type: "engagementNoteDeleteInProgress",
  note: EngagementNote
}

export function engagementNoteDeleteInProgress(note: EngagementNote): EngagementNoteDeleteInProgress {
  return {
    type: "engagementNoteDeleteInProgress",
    note
  }
}

export interface EngagementNoteDeleteFailed {
  type: "engagementNoteDeleteFailed",
  note: EngagementNote
}

export function engagementNoteDeleteFailed(note: EngagementNote): EngagementNoteDeleteFailed {
  return {
    type: "engagementNoteDeleteFailed",
    note
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