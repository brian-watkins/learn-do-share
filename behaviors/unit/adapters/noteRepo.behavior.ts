import { EngagementNoteReader, EngagementNoteWriter } from "@/src/engage/backstage";
import { behavior, effect, example, step } from "esbehavior";
import { User } from "@/api/common/user"
import { EngagementNote, EngagementNoteContents } from "@/src/engage/engagementNotes";
import { LearningArea } from "@/src/engage/learningArea";
import { expect } from "chai";
import { EngagementNoteCounter } from "@/src/overview/backstage";

function TestUser(testId: number): User {
  return {
    identifier: `test-user-${testId}`,
    name: `user-${testId}@email.com`
  }
}

function TestNoteContents(testId: number): EngagementNoteContents {
  return {
    content: `Here is some great note content #${testId}`,
    date: new Date().toISOString()
  }
}

function TestLearningArea(testId: number): LearningArea {
  return {
    id: `learning-area-${testId}`,
    title: `Learn About Things ${testId}`,
    content: `Some things about learning area ${testId}`,
    category: "My Category"
  }
}

export default (reader: EngagementNoteReader, counter: EngagementNoteCounter, writer: EngagementNoteWriter) =>
  behavior("Reading, Writing, and Counting Notes", [
    example({ init: () => new Map<string, EngagementNote>() })
      .script({
        perform: [
          step("create two notes for a learning area", async (context) => {
            const note = await writer.write(TestUser(1), TestLearningArea(1).id, TestNoteContents(1))
            expect(note.id).to.not.be.null
            context.set("saved-note-1", note)
            const note2 = await writer.write(TestUser(1), TestLearningArea(1).id, TestNoteContents(2))
            expect(note2.id).to.not.be.null
            context.set("saved-note-2", note2)
          }),
          step("create a note in another learning area", async (context) => {
            const note = await writer.write(TestUser(1), TestLearningArea(2).id, TestNoteContents(3))
            expect(note.id).to.not.be.null
            context.set("saved-note-3", note)
          }),
          step("create a note for another user", async (context) => {
            const note = await writer.write(TestUser(2), TestLearningArea(1).id, TestNoteContents(4))
            expect(note.id).to.not.be.null
            context.set("saved-note-4", note)
          })
        ],
        observe: [
          effect("two notes were created", async () => {
            const notes = await reader.read(TestUser(1), TestLearningArea(1))
            expect(notes).to.have.length(2)
          }),
          effect("the correct count is returned for the learning area", async () => {
            const counts = await counter.countByLearningArea(TestUser(1))
            expect(counts).to.have.length(2)
            expect(counts).to.deep.include({
              learningAreaId: "learning-area-1",
              noteCount: 2
            })
            expect(counts).to.deep.include({
              learningAreaId: "learning-area-2",
              noteCount: 1
            })
          }),
          effect("the notes are read in reverse chronological order", async (context) => {
            const notes = await reader.read(TestUser(1), TestLearningArea(1))
            expect(notes[0]).to.deep.equal(context.get("saved-note-2"))
            expect(notes[1]).to.deep.equal(context.get("saved-note-1"))
          })
        ]
      }).andThen({
        perform: [
          step("delete a note", async (context) => {
            await writer.delete(TestUser(1), context.get("saved-note-1")!)
          })
        ],
        observe: [
          effect("the note was deleted", async (context) => {
            const notes = await reader.read(TestUser(1), TestLearningArea(1))
            expect(notes).to.have.length(1)
            expect(notes[0]).to.deep.equal(context.get("saved-note-2"))
          }),
          effect("the counts are updated for the learning area", async () => {
            const counts = await counter.countByLearningArea(TestUser(1))
            expect(counts).to.have.length(2)
            expect(counts).to.deep.include({
              learningAreaId: "learning-area-1",
              noteCount: 1
            })
            expect(counts).to.deep.include({
              learningAreaId: "learning-area-2",
              noteCount: 1
            })
          })
        ]
      })
  ])
