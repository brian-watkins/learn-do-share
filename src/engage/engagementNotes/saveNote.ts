import { EngagementNoteContents } from "./index.js"
import { LearningArea } from "../learningArea.js"


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
