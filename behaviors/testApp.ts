import { Context } from "esbehavior"
import { LearningArea } from "../src/overview/learningAreas"
import { TestDisplay } from "./testDisplay"
import https from 'https'
import { ResetableEngagementPlanRepo } from "./testStore"
import { TestServer } from "./testServer"
import { LearningAreaCategory } from "../src/overview/learningAreaCategory"
import { LearningAreaReader } from "../src/engage/learningAreaReader"
import { LearningArea as EngageLearningArea } from "../src/engage/learningArea"
import { LearningAreasReader } from "../src/overview/backstage"

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
  learningAreaReader = new FakeLearningAreaReader()
  engagementPlanRepo = new ResetableEngagementPlanRepo({
    endpoint: "https://localhost:3021",
    key: "some-dumb-key",
    database: "lds-test",
    container: "engagement-plans-test",
    agent: new https.Agent({ rejectUnauthorized: false })
  })

  withLearningAreas(learningAreas: Array<TestLearningArea>): TestContext {
    this.learningAreasReader.resolveImmediatelyWith(learningAreas)
    this.learningAreaReader.areas = learningAreas
    return this
  }

  async start(path: string = ""): Promise<void> {
    await this.server.start({
      learningAreaReader: this.learningAreaReader,
      learningAreasReader: this.learningAreasReader,
      engagementPlanWriter: this.engagementPlanRepo,
      engagementPlanReader: this.engagementPlanRepo
    })
    await this.display.start(this.server.host() + path)
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
  private areas: TestLearningArea[] | null = null

  constructor() { }

  async read(): Promise<Array<LearningArea>> {
    return this.areas?.map(toLearningArea) ?? []
  }

  resolveImmediatelyWith(areas: Array<TestLearningArea>) {
    this.areas = areas
  }
}

class FakeLearningAreaReader implements LearningAreaReader {
  public areas: TestLearningArea[] = []

  async read(id: string): Promise<EngageLearningArea | null> {
    return this.areas.filter(area => area.id === id).map(toAreaToEngage)[0] ?? null
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

  withContent(content: string): TestLearningArea {
    this.content = content
    return this
  }

  withCategory(category: LearningAreaCategory): TestLearningArea {
    this.category = category
    return this
  }
}

function toAreaToEngage(area: TestLearningArea): EngageLearningArea {
  return {
    id: area.id,
    content: area.content,
    title: area.title,
    category: area.category
  }
}

function toLearningArea(area: TestLearningArea): LearningArea {
  return {
    id: area.id,
    title: area.title,
    category: area.category
  }
}

export function FakeLearningArea(testId: number): TestLearningArea {
  return new TestLearningArea(testId)
}