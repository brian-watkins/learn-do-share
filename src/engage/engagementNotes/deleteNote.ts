import { EngagementNote } from "./index.js";

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
