import { Context } from "esbehavior"
import { Server } from "http"
import { Page } from "playwright"
import { LearningArea, LearningAreasReader } from "../src/requestLearningAreas"
import { Adapters } from "../src/requests"
import { createServerApp } from "../src/server"
import { newBrowserPage } from "./browser"

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
  learningAreas: Array<LearningArea> = []

  withLearningAreas(learningAreas: Array<TestLearningArea>): TestContext {
    this.learningAreas = learningAreas.map(tla => {
      return {
        title: tla.title
      }
    })
    return this
  }

  async start(): Promise<void> {
    await this.server.start({
      learningAreasReader: new FakeLearningAreasReader(this.learningAreas)
    })
    await this.display.start()
  }

  async stop(): Promise<void> {
    await this.display.stop()
    await this.server.stop()
  }
}

class FakeLearningAreasReader implements LearningAreasReader {
  constructor (private learningAreas: Array<LearningArea>) {}

  async read(): Promise<Array<LearningArea>> {
    return this.learningAreas
  }
}

class TestServer {
  private server: Server | null = null

  start(adapters: Adapters): Promise<void> {
    const app = createServerApp(adapters)

    return new Promise((resolve) => {
      this.server = app.listen(7778, () => {
        resolve()
      })
    })
  }

  stop(): Promise<void> {
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

class TestDisplay {
  private page: Page | null = null
  
  async start(): Promise<void> {
    this.page = await newBrowserPage()
    await this.page.goto("http://localhost:7777")
  }

  async stop(): Promise<void> {
    await this.page?.close()
    this.page = null
  }

  async pageText(): Promise<string | null> {
    return this.page?.textContent("body") ?? null
  }
}

class TestLearningArea {
  constructor(public testId: number) {}

  get title(): string {
    return `Learning Area ${this.testId}`
  }
}

export function FakeLearningArea(testId: number): TestLearningArea {
  return new TestLearningArea(testId)
}