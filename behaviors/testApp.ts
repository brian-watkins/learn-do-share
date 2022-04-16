import { Context } from "esbehavior"
import { LearningArea } from "../src/learningAreas"
import { TestDisplay } from "./testDisplay"
import https from 'https'
import { ResetableEngagementPlanRepo } from "./testStore"
import { LearningAreasReader } from "../src/readLearningAreas"
import { TestServer } from "./testServer"

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
  display = new TestDisplay()
  server = new TestServer()
  learningAreasReader = new FakeLearningAreasReader()
  engagementPlanRepo = new ResetableEngagementPlanRepo({
    endpoint: "https://localhost:3021",
    key: "some-dumb-key",
    database: "lds-test",
    container: "engagement-plans-test",
    agent: new https.Agent({ rejectUnauthorized: false })
  })

  withLearningAreas(learningAreas: Array<TestLearningArea>): TestContext {
    this.learningAreasReader.resolveImmediatelyWith(learningAreas)
    return this
  }

  async start(): Promise<void> {
    await this.server.start({
      learningAreasReader: this.learningAreasReader,
      engagementPlanWriter: this.engagementPlanRepo,
      engagementPlanReader: this.engagementPlanRepo
    })
    await this.display.start(this.server.host())
  }

  async stop(): Promise<void> {
    await this.engagementPlanRepo.reset()
    await this.display.stop()
    await this.server.stop()
  }

  async reload(): Promise<void> {
    await this.display.stop()
    await this.display.start(this.server.host())
  }
}

class FakeLearningAreasReader implements LearningAreasReader {
  private areas: LearningArea[] | null = null

  constructor() { }

  async read(): Promise<Array<LearningArea>> {
    return this.areas!
  }

  resolveImmediatelyWith(areas: Array<LearningArea>) {
    this.areas = areas
  }
}

export class TestLearningArea implements LearningArea {
  title: string
  content: string
  id: string

  constructor(public testId: number) {
    this.id = `learning-area-${testId}`
    this.title = `Learning Area ${testId}`
    this.content = `Here is some content for learning Area ${testId}!`
  }

  withContent(content: string): TestLearningArea {
    this.content = content
    return this
  }
}

export function FakeLearningArea(testId: number): TestLearningArea {
  return new TestLearningArea(testId)
}