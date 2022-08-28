import { DisplayElement, DisplayElementList, SelectorOptions } from "behaviors/helpers/displayElement"
import { Context } from "esbehavior"
import { Page } from "playwright"
import { BackstageResponseOptions } from "./engageTestContext"
import { TestLearningArea } from "./fakes/learningArea"
import { TestUser } from "./fakes/user"
import { TestEngagementNote } from "./fakes/note"
import { PlaywrightDisplayElement, PlaywrightDisplayElementList, waitForRequestsToComplete } from "behaviors/helpers/playwrightDisplayElement"
import { EngagementLevel } from "@/src/engage/engagementPlans"

export function learningAreaTestContext(page: Page, area: TestLearningArea): Context<EngageTestContextProxy> {
  return {
    init: async () => {
      const proxy = new EngageTestContextProxy(page, area)
      await proxy.create()
      return proxy
    },
    teardown: (proxy) => {
      return proxy.stop()
    }
  }
}

export class EngageTestContextProxy {
  attributes: { [key:string]: any } = {}

  constructor(private page: Page, private area: TestLearningArea) { }

  create(): Promise<void> {
    return this.page.evaluate((area) => {
      window._testContext = window.createEngageTestContext(area)
    }, this.area)
  }

  start(): Promise<void> {
    return this.page.evaluate(() => {
      return window._testContext?.start()
    })
  }

  withUser(user: TestUser): Promise<void> {
    return this.page.evaluate((user) => {
      window._testContext?.withUser(user)
    }, user)
  }

  withNotes(notes: Array<TestEngagementNote>): Promise<void> {
    return this.page.evaluate((notes) => {
      window._testContext?.withNotes(notes)
    }, notes)
  }

  withEngagementLevels(levels: Array<EngagementLevel>): Promise<void> {
    return this.page.evaluate((levels) => {
      window._testContext?.withEngagementLevels(levels)
    }, levels)
  }

  stop(): Promise<void> {
    return this.page.evaluate(() => {
      window._testContext?.stop()
      window._testContext = null
    })
  }

  stubBackstageResponse(response: any, options: BackstageResponseOptions): Promise<void> {
    return this.page.evaluate((args) => {
      window._testContext?.stubBackstageResponse(args.response, args.options)
    }, { response, options })
  }

  selectElementWithText(text: string): DisplayElement {
    return PlaywrightDisplayElement.withText(this.page!, text)
  }

  select(selector: string, options: SelectorOptions = {}): DisplayElement {
    return PlaywrightDisplayElement.fromSelector(this.page!, selector, options)
  }

  selectAll(selector: string): DisplayElementList {
    return PlaywrightDisplayElementList.fromSelector(this.page!, selector)
  }

  waitForRequestsToComplete(): Promise<void> {
    return waitForRequestsToComplete(this.page!)
  }
}
