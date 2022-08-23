import { EngagementNote, NoteState } from "@/src/engage/engagementNotes"
import { TestLearningArea } from "./learningArea"

export class TestEngagementNote implements EngagementNote {
  state: NoteState = NoteState.Retrieved
  id: string
  content: string
  date: string

  constructor(public user: string, public learningArea: TestLearningArea, public testId: number) {
    this.id = `note-${testId}`
    this.content = `Some funny note ${testId}`
    this.date = new Date().toISOString()
  }

  withContent(content: string): TestEngagementNote {
    this.content = content
    return this
  }

  withDate(date: Date): TestEngagementNote {
    this.date = date.toISOString()
    return this
  }
}

export function FakeNote(user: string, learningArea: TestLearningArea, testId: number) {
  return new TestEngagementNote(user, learningArea, testId)
}