import { User } from "@/api/common/user.js";
import { EngagementNoteCounter, NoteCount } from "@/src/overview/backstage.js";
import { EngagementNoteReader, EngagementNoteWriter } from "@/src/engage/backstage.js"
import { EngagementNote, EngagementNoteContents } from "@/src/engage/engagementNotes/index.js";
import { LearningArea } from "@/src/engage/learningArea.js";
import fetch from "node-fetch";

export class HttpEngagementNoteCounter implements EngagementNoteCounter {
  async countByLearningArea(user: User): Promise<NoteCount[]> {
    const response = await fetch(`http://localhost:7171/user/${user.identifier}/noteCounts`)
    const data = await response.json()
    return data as Array<NoteCount>
  }
}

export class HttpEngagementNoteReader implements EngagementNoteReader {
  async read(user: User, learningArea: LearningArea): Promise<EngagementNote[]> {
    const response = await fetch(`http://localhost:7171/user/${user.identifier}/notes?learningAreaId=${learningArea.id}`)
    const data = await response.json()
    return data as Array<EngagementNote>
  }
}

export class HttpNoteEngageWriter implements EngagementNoteWriter {
  async write(user: User, learningAreaId: string, content: EngagementNoteContents): Promise<EngagementNote> {
    const response = await fetch(`http://localhost:7171/user/${user.identifier}/notes`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: user.name,
        learningAreaId,
        content
      })
    })
    const data = await response.json()
    return data as EngagementNote
  }

  async delete(user: User, note: EngagementNote): Promise<void> {
    await fetch(`http://localhost:7171/user/${user.identifier}/notes/${note.id}`, {
      method: "DELETE"
    })
  }
}