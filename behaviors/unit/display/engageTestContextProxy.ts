import { DisplayElement, DisplayElementList, SelectorOptions } from "behaviors/helpers/displayElement"
import { waitForRequestsToComplete } from "../../helpers/displayHelpers"
import { Context } from "esbehavior"
import { Page } from "playwright"
import { BackstageResponseOptions } from "./engageTestContext"
import { TestLearningArea } from "./fakes/learningArea"
import { TestUser } from "./fakes/user"
import { TestEngagementNote } from "./fakes/note"

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
  constructor(private page: Page, private area: TestLearningArea) { }

  create(): Promise<void> {
    return this.page.evaluate((area) => {
      window._testContext = window.createEngageTestContext(area)
    }, this.area)
  }

  start(): Promise<void> {
    return this.page.evaluate(() => {
      return window._testContext.start()
    })
  }

  withUser(user: TestUser): Promise<void> {
    return this.page.evaluate((user) => {
      window._testContext.withUser(user)
    }, user)
  }

  withNotes(notes: Array<TestEngagementNote>): Promise<void> {
    return this.page.evaluate((notes) => {
      window._testContext.withNotes(notes)
    }, notes)
  }

  stop(): Promise<void> {
    return this.page.evaluate(() => {
      window._testContext.stop()
    })
  }

  stubBackstageResponse(response: any, options: BackstageResponseOptions): Promise<void> {
    return this.page.evaluate((args) => {
      window._testContext.stubBackstageResponse(args.response, args.options)
    }, { response, options })
  }

  selectElementWithText(text: string): DisplayElement {
    return DisplayElement.withText(this.page!, text)
  }

  select(selector: string, options: SelectorOptions = {}): DisplayElement {
    return DisplayElement.fromSelector(this.page!, selector, options)
  }

  selectAll(selector: string): DisplayElementList {
    return DisplayElementList.fromSelector(this.page!, selector)
  }

  waitForRequestsToComplete(): Promise<void> {
    return waitForRequestsToComplete(this.page!)
  }
}
