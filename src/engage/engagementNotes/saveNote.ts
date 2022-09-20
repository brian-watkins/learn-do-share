import { getBackstageResult } from "@/api/backstage/adapter"
import { receiveMessage } from "@/display/procedure"
import { Error, Personalized } from "../display"
import { EngagementNote, EngagementNoteContents, engagementNoteSaving, engagementNotesRetrieved } from "./index"
import { LearningArea } from "../learningArea"


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

export const saveNote =
  receiveMessage<EngagementNoteCreationRequested, Personalized | Error>("engagementNoteCreationRequested")
    .updateView((state) => {
      state.engagementNotes = engagementNoteSaving(state.engagementNotes.notes)
    })
    .andThen(message => getBackstageResult<EngagementNote>(message))
    .updateView((state, result) => result.when({
      ok: value => {
        state.engagementNotes = engagementNotesRetrieved([value, ...state.engagementNotes.notes])
      },
      error: () => {
        state.engagementNotes = engagementNotesRetrieved(state.engagementNotes.notes)
        state.type = "error"
      }
    }))
