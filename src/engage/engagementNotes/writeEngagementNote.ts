import { Subscription, subscribe } from "@/display/message"
import { LearningArea } from "../learningArea"
import { EngagementNote, EngagementNoteContents } from "."
import { sendBackstage } from "@/api/backstage/adapter"

export interface NoteModel {
  learningArea: LearningArea,
  engagementNotes: Array<EngagementNote>
}

export const subscriptions: Array<Subscription<NoteModel, any>> = [
  subscribe("engagementNoteCreationRequested", {
    do: sendBackstage
  }),
  subscribe("engagementNotePersisted", {
    update: (model, action) => {
      model.engagementNotes.unshift(action.note)      
    }
  }),
  subscribe("engagementNoteDeleteRequested", {
    do: sendBackstage
  }),
  subscribe("engagementNoteDeleted", {
    update: (model, action) => {
      model.engagementNotes = model.engagementNotes.filter(note => note.id !== action.note.id)
    }
  })
]

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