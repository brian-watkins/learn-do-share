import { User } from "@/api/common/user";
import { EngagementNoteReader, EngagementNoteWriter } from "@/src/engage/backstage";
import { EngagementNote, EngagementNoteContents, NoteState } from "@/src/engage/engagementNotes";
import { EngagementNoteReader as OverviewNoteReader, NoteCount } from "@/src/overview/backstage"
import { LearningArea } from "@/src/engage/learningArea";
import { CosmosConnection } from "./cosmosConnection";
import { FeedResponse } from "@azure/cosmos";

export class CosmosEngagementNoteRepository implements EngagementNoteReader, OverviewNoteReader, EngagementNoteWriter {

  constructor(private connection: CosmosConnection, private container: string = "engagement-notes") { }

  countByLearningArea(user: User): Promise<NoteCount[]> {
    return this.connection.execute(this.container, async (notes) => {
      const { resources }: FeedResponse<NoteCount> = await notes.items.query({
        query: "SELECT n.learningAreaId, count(1) as noteCount FROM n WHERE n.userId = @userId GROUP BY n.learningAreaId",
        parameters: [
          { name: "@userId", value: user.identifier }
        ]
      }, { partitionKey: user.identifier })
        .fetchAll()

      return resources
    })
  }

  async read(user: User, learningArea: LearningArea): Promise<EngagementNote[]> {
    return this.connection.execute(this.container, async (notes) => {
      const { resources } = await notes.items.query({
        query: "SELECT n.id, n.content, n.date, 0 as state FROM notes n WHERE n.userId = @userId AND n.learningAreaId = @learningAreaId ORDER BY n.date DESC",
        parameters: [
          { name: "@userId", value: user.identifier },
          { name: "@learningAreaId", value: learningArea.id }
        ]
      }, { partitionKey: user.identifier })
        .fetchAll()
  
      return resources
    })
  }

  async write(user: User, learningAreaId: string, noteContents: EngagementNoteContents): Promise<EngagementNote> {
    return this.connection.execute(this.container, async (notes) => {
      const storeableNote = {
        content: noteContents.content,
        date: noteContents.date,
        userId: user.identifier,
        learningAreaId
      }

      const { resource } = await notes.items.create(storeableNote)

      if (!resource) {
        return Promise.reject("Unable to create note!")
      }

      return {
        id: resource.id,
        content: resource.content,
        date: resource.date,
        state: NoteState.Retrieved
      }
    })
  }

  async delete(user: User, note: EngagementNote): Promise<void> {
    return this.connection.execute(this.container, async (notes) => {
      await notes.item(note.id, user.identifier).delete()
    })
  }
}