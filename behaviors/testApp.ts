import https from 'https'
import { Context } from "esbehavior"
import { TestDisplay } from "./testDisplay"
import { resetCosmos } from "./services/testStore"
import { LearningArea } from "@/src/overview/learningAreas"
import { LearningAreaCategory } from "@/src/overview/learningAreaCategory"
import { EngagementLevel, EngagementPlan } from '@/src/engage/engagementPlans'
import { User } from "@/api/common/user"
import { userIdentifierFor } from './helpers'
import { TestLearningAreasServer } from './services/testLearningAreasServer'
import { serverHost } from './services/testServer'
import { CosmosConnection } from '@/adapters/cosmosConnection'
import { CosmosEngagementPlanRepository } from '@/adapters/cosmosEngagementPlanRepository'
import { CosmosEngagementNoteRepository } from '@/adapters/cosmosEngagementNoteRepository'
import { PageOptions } from './services/browser'

export function testContext(): Context<TestContext> {
  return {
    init: async () => {
      return new TestContext()
    },
    teardown: async (testApp) => {
      await testApp.stop()
    }
  }
}

export class TestContext {
  date: Date | null = null
  user: string | null = null
  display = new TestDisplay()
  learningAreasServer = new TestLearningAreasServer()
  cosmosConnection = new CosmosConnection({
    endpoint: "https://localhost:3021",
    key: "some-dumb-key",
    database: "lds-test",
    agent: new https.Agent({ rejectUnauthorized: false })
  })
  engagementPlans: Map<string, Array<EngagementPlan>> = new Map()
  engagementNotes: Array<TestEngagementNote> = []

  setDate(date: Date) {
    this.date = date
  }

  withAuthenticatedUser(user: string): TestContext {
    this.user = user
    return this
  }

  withLearningAreas(learningAreas: Array<TestLearningArea>): TestContext {
    this.learningAreasServer.areas = learningAreas
    return this
  }

  withEngagementPlan(userName: string, learningArea: TestLearningArea, engagementLevel: EngagementLevel): TestContext {
    let plans = this.engagementPlans.get(userName)
    if (!plans) {
      plans = [{ learningArea: learningArea.id, level: engagementLevel }]
      this.engagementPlans.set(userName, plans)
    } else {
      plans.push({ learningArea: learningArea.id, level: engagementLevel })
    }
    return this
  }

  withEngagementNotes(notes: Array<TestEngagementNote>): TestContext {
    this.engagementNotes = notes
    return this
  }

  async writeEngagementPlans(): Promise<void> {
    const engagementPlanRepo = new CosmosEngagementPlanRepository(this.cosmosConnection)

    for (const [userName, plans] of this.engagementPlans) {
      const user: User = {
        identifier: userIdentifierFor(userName),
        name: userName
      }
      for (const plan of plans) {
        await engagementPlanRepo.write(user, plan)
      }
    }
  }

  async writeEngagementNotes(): Promise<void> {
    const engagementNoteRepo = new CosmosEngagementNoteRepository(this.cosmosConnection)

    for (const note of this.engagementNotes) {
      const user: User = {
        identifier: userIdentifierFor(note.user),
        name: note.user
      }
      await engagementNoteRepo.write(user, note.learningArea.id, {
        content: note.content,
        date: note.date.toISOString()
      })
    }
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
    await this.writeEngagementPlans()
    await this.writeEngagementNotes()
    await this.learningAreasServer.start()
    await this.display.start(serverHost() + path, this.pageOptions)
  }

  async stop(): Promise<void> {
    await resetCosmos(this.cosmosConnection)
    await this.learningAreasServer.stop()
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

class TestEngagementNote {
  content: string
  date: Date

  constructor(public user: string, public learningArea: TestLearningArea, public testId: number) {
    this.content = `Some funny note ${testId}`
    this.date = new Date()
  }

  withContent(content: string): TestEngagementNote {
    this.content = content
    return this
  }

  withDate(date: Date): TestEngagementNote {
    this.date = date
    return this
  }
}

export function FakeEngagementNote(user: string, learningArea: TestLearningArea, testId: number): TestEngagementNote {
  return new TestEngagementNote(user, learningArea, testId)
}