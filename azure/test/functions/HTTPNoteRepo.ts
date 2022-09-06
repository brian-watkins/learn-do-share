import { User } from "@/api/common/user";
import { EngagementNoteReader, NoteCount } from "@/src/overview/backstage";
import { EngagementNoteReader as EngageReader, EngagementNoteWriter } from "@/src/engage/backstage"
import { EngagementNote, EngagementNoteContents } from "@/src/engage/engagementNotes";
import { LearningArea } from "@/src/engage/learningArea";
import fetch from "node-fetch";

export class HttpNoteOverviewReader implements EngagementNoteReader {
  async countByLearningArea(user: User): Promise<NoteCount[]> {
    const response = await fetch(`http://localhost:7171/user/${user.identifier}/noteCounts`)
    const data = await response.json()
    return data as Array<NoteCount>
  }
}

export class HttpNoteEngageReader implements EngageReader {
  async read(user: User, learningArea: LearningArea): Promise<EngagementNote[]> {
    const response = await fetch(`http://localhost:7171/user/${user.identifier}/notes?learningAreaId=${learningArea.id}`)
    const data = await response.json()
    return data as Array<EngagementNote>
  }
}

export class HttpNoteEngageWriter implements EngagementNoteWriter {
  async write(user: User, learningAreaId: string, content: EngagementNoteContents): Promise<EngagementNote> {
    console.log("Writing new note!")
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
    console.log("Deleting note", note)
    await fetch(`http://localhost:7171/user/${user.identifier}/notes/${note.id}`, {
      method: "DELETE"
    })
    console.log("GELLO!??")
  }
}