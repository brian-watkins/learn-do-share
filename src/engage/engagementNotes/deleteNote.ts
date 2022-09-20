import { getBackstageResult } from "@/api/backstage/adapter";
import { receiveMessage } from "@/display/procedure";
import { Error, Personalized } from "../display";
import { EngagementNote, NoteState } from ".";

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

export const deleteNote =
  receiveMessage<EngagementNoteDeleteRequested, Personalized | Error>("engagementNoteDeleteRequested")
    .updateView((state, message) => {
      const note = state.engagementNotes.notes.find(note => note.id === message.note.id)
      if (note) {
        note.state = NoteState.Deleting
      }
    })
    .andThen(async (message) => ({
      result: await getBackstageResult<EngagementNote>(message),
      note: message.note
    }))
    .updateView((state, value) => {
      value.result.when({
        ok: (value) => state.engagementNotes.notes = state.engagementNotes.notes.filter(note => note.id !== value.id),
        error: () => {
          const note = state.engagementNotes.notes.find(note => note.id === value.note.id)
          if (note) {
            note.state = NoteState.FailedDeleting
          }
          state.type = "error"
        }
      })
    })