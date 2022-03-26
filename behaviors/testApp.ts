import { Context } from "esbehavior"
import { Server } from "http"
import { Page } from "playwright"
import { createServer } from "../local/backstage/app"
import { LearningArea } from "../src/learningAreas"
import { LearningAreasReader } from "../src/requestLearningAreas"
import { Adapters } from "../src/backstage"
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
  learningAreasReader = new FakeLearningAreasReader()

  withLearningAreas(learningAreas: Array<TestLearningArea>): TestContext {
    this.learningAreasReader.resolveImmediatelyWith(learningAreas)
    return this
  }

  resolveLearningAreasRequestWith(learningAreas: Array<TestLearningArea>) {
    this.learningAreasReader.resolveWith(learningAreas)
  }

  async start(): Promise<void> {
    await this.server.start({
      learningAreasReader: this.learningAreasReader
    })
    await this.display.start()
  }

  async stop(): Promise<void> {
    await this.display.stop()
    this.learningAreasReader.stop()
    await this.server.stop()
  }
}

class FakeLearningAreasReader implements LearningAreasReader {
  private resolver: ((areas: LearningArea[]) => void) | null = null
  private areas: LearningArea[] | null = null

  constructor() { }

  async read(): Promise<Array<LearningArea>> {
    if (this.areas == null) {
      return new Promise((resolve) => {
        this.resolver = resolve
      })
    } else {
      return this.areas
    }
  }

  resolveWith(areas: Array<LearningArea>) {
    if (this.resolver != null) {
      this.resolver(areas)
      this.resolver = null
    }
  }

  resolveImmediatelyWith(areas: Array<LearningArea>) {
    this.areas = areas
  }

  stop() {
    // this avoids having the test hang if there was a failure in the middle of a script
    // that only later resolves the learning areas request
    if (this.resolver != null) {
      this.resolveWith([])
    }
  }
}

class TestServer {
  private server: Server | null = null

  start(adapters: Adapters): Promise<void> {
    const app = createServer(adapters)

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

  async isVisible(selector: string): Promise<boolean> {
    return this.page?.isVisible(selector) ?? false
  }
}

class TestLearningArea implements LearningArea {
  title: string

  constructor(public testId: number) {
    this.title = `Learning Area ${testId}`
  }
}

export function FakeLearningArea(testId: number): TestLearningArea {
  return new TestLearningArea(testId)
}