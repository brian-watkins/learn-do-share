import https from 'https'
import { Context } from "esbehavior"
import { TestDisplay } from "./testDisplay"
import { ResetableEngagementPlanRepo } from "./testStore"
import { LearningArea } from "@/src/overview/learningAreas"
import { LearningAreaCategory } from "@/src/overview/learningAreaCategory"
import { EngagementLevel, EngagementPlan } from '@/src/engage/engagementPlans'
import { User } from "@/api/common/user"
import { userIdentifierFor } from './helpers'
import { TestLearningAreasServer } from './testLearningAreasServer'
import { serverHost } from './testServer'

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
  learningAreasServer = new TestLearningAreasServer()
  engagementPlanRepo = new ResetableEngagementPlanRepo({
    endpoint: "https://localhost:3021",
    key: "some-dumb-key",
    database: "lds-test",
    container: "engagement-plans",
    agent: new https.Agent({ rejectUnauthorized: false })
  })
  engagementPlans: Map<string, Array<EngagementPlan>> = new Map()

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

  async writeEngagementPlans(): Promise<void> {
    for (const [userName, plans] of this.engagementPlans) {
      const user: User = {
        identifier: userIdentifierFor(userName),
        name: userName
      }
      for (const plan of plans) {
        await this.engagementPlanRepo.write(user, plan)
      }
    }
  }

  async start(path: string = ""): Promise<void> {
    await this.writeEngagementPlans()
    await this.learningAreasServer.start()
    await this.display.start(serverHost() + path)
  }

  async stop(): Promise<void> {
    await this.engagementPlanRepo.reset()
    await this.learningAreasServer.stop()
    await this.display.stop()
  }

  async reload(): Promise<void> {
    await this.display.stop()
    await this.display.start(serverHost())
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