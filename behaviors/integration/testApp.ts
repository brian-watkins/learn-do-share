import { Context } from "esbehavior"
import { TestDisplay } from "./testDisplay.js"
import { LearningArea } from "@/src/overview/learningAreas.js"
import { LearningAreaCategory } from "@/src/overview/learningAreaCategory.js"
import { EngagementLevel, EngagementPlan } from '@/src/engage/engagementPlans/index.js'
import { userIdentifierFor } from './helpers.js'
import { serverHost } from './services/testServer.js'
import { PageOptions } from './services/browser.js'
import { TestDataServer } from './services/testDataServer.js'
import { EngagementNote } from '@/src/engage/engagementNotes/index.js'

export function testContext(): Context<TestContext> {
  return {
    init: async () => {
      return new TestContext()
    },
    teardown: async (testContext) => {
      await testContext.stop()
    }
  }
}

export class TestContext {
  date: Date | null = null
  user: string | null = null
  display = new TestDisplay()
  testDataServer = new TestDataServer()
  attributes: { [key:string]: any } = {}

  setDate(date: Date) {
    this.date = date
  }

  withAuthenticatedUser(user: string): TestContext {
    this.user = user
    return this
  }

  withLearningAreas(learningAreas: Array<TestLearningArea>): TestContext {
    this.testDataServer.areas = learningAreas
    return this
  }

  withEngagementPlan(userName: string, learningArea: TestLearningArea, engagementLevel: EngagementLevel): TestContext {
    this.testDataServer.plans.push(new TestEngagementPlan(userIdentifierFor(userName), learningArea.id, engagementLevel))
    return this
  }

  withEngagementNotes(notes: Array<TestEngagementNote>): TestContext {
    this.testDataServer.notes = notes.map(note => note.withUser(userIdentifierFor(note.user)))
    return this
  }

  async startAtLearningArea(learningArea: TestLearningArea): Promise<void> {
    await this.start(`/learning-areas/${learningArea.id}`)
  }

  get pageOptions(): PageOptions {
    return {
      date: this.date,
      user: this.user
    }
  }

  async start(path: string = ""): Promise<void> {
    await this.testDataServer.start()
    await this.display.start(serverHost() + path, this.pageOptions)
  }

  async stop(): Promise<void> {
    await this.testDataServer.stop()
    await this.display.stop()
  }

  async reload(): Promise<void> {
    await this.display.stop()
    await this.display.start(serverHost(), this.pageOptions)
  }

  async reloadPage(): Promise<void> {
    await this.display.goto(serverHost())
  }
}

export class TestLearningArea implements LearningArea {
  title: string
  content: string
  id: string
  selected: boolean
  category: LearningAreaCategory

  constructor(public testId: number) {
    this.id = `learning-area-${testId}`
    this.title = `Learning Area ${testId}`
    this.content = `Here is some content for learning Area ${testId}!`
    this.selected = false
    this.category = LearningAreaCategory.Discipline
  }

  withTitle(title: string): TestLearningArea {
    this.title = title
    return this
  }

  withContent(content: string): TestLearningArea {
    this.content = content
    return this
  }

  withCategory(category: LearningAreaCategory): TestLearningArea {
    this.category = category
    return this
  }
}

export function FakeLearningArea(testId: number): TestLearningArea {
  return new TestLearningArea(testId)
}

export class TestEngagementNote implements EngagementNote {
  content: string
  date: string
  id: string

  constructor(public user: string, public learningAreaId: string, public testId: number) {
    this.content = `Some funny note ${testId}`
    this.date = new Date().toISOString()
    this.id = `note-${testId}`
  }

  withContent(content: string): TestEngagementNote {
    this.content = content
    return this
  }

  withDate(date: Date): TestEngagementNote {
    this.date = date.toISOString()
    return this
  }

  withUser(user: string): TestEngagementNote {
    this.user = user
    return this
  }
}

export function FakeEngagementNote(user: string, learningArea: TestLearningArea, testId: number): TestEngagementNote {
  return new TestEngagementNote(user, learningArea.id, testId)
}

export class TestEngagementPlan implements EngagementPlan {
  constructor(public userId: string, public learningArea: string, public level: EngagementLevel) {}
}