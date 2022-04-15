import { Context } from "esbehavior"
import { Server } from "http"
import { createServer, stopVite } from "../local/backstage/app"
import { LearningArea } from "../src/learningAreas"
import { Adapters } from "../src/backstage"
import { TestDisplay } from "./testDisplay"
import https from 'https'
import { ResetableEngagementPlanRepo } from "./testStore"
import { LearningAreasReader } from "../src/readLearningAreas"
import { ChildProcess, spawn } from "child_process"

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
    await this.display.start("http://localhost:4280")
  }

  async stop(): Promise<void> {
    await this.engagementPlanRepo.reset()
    await this.display.stop()
    await this.server.stop()
  }

  async reload(): Promise<void> {
    await this.display.stop()
    await this.display.start("http://localhost:7778")
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

class TestServer {
  private server: Server | null = null
  private swaCli: ChildProcess | null = null

  async start(adapters: Adapters): Promise<void> {
    const app = await createServer(adapters)

    return new Promise((resolve) => {
      this.server = app.listen(7778, async () => {
        this.swaCli = spawn("node_modules/.bin/swa", ["start", "http://localhost:7778", "--api-location", "http://localhost:7778"])

        this.swaCli?.stdout?.on("data", (data) => {
          const output = String(data)
          if (output.includes("emulator started")) {
            resolve()
          }
        })

        this.swaCli?.stderr?.on("data", (data) => {
          console.log("SWA CLI ERROR:", String(data))
        })
      })
    })
  }

  async stop(): Promise<void> {
    await stopVite()
    this.swaCli?.kill()

    return new Promise((resolve) => {
      if (this.server == null) {
        resolve()
        return
      }

      this.server.close(() => {
        resolve()
      })
    })
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