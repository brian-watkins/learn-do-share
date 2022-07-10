import { User } from "@/api/common/user";
import { EngagementNoteReader } from "@/src/engage/backstage";
import { EngagementNoteContents } from "@/src/engage/engagementNotes";
import { LearningArea } from "@/src/engage/learningArea";
import { EngagementNote } from "@/src/engage/personalizedLearningArea";
import { CosmosConnection } from "./cosmosConnection";

const NOTES_CONTAINER = "engagement-notes"

export class CosmosEngagementNoteRepository implements EngagementNoteReader {

  constructor(private connection: CosmosConnection) { }

  async read(user: User, learningArea: LearningArea): Promise<EngagementNote[]> {
    return this.connection.execute(NOTES_CONTAINER, async (notes) => {
      const { resources } = await notes.items.query({
        query: "SELECT n.id, n.content, n.date FROM notes n WHERE n.userId = @userId AND n.learningAreaId = @learningAreaId ORDER BY n.date DESC",
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
    return this.connection.execute(NOTES_CONTAINER, async (notes) => {
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
        date: resource.date
      }
    })
  }
}