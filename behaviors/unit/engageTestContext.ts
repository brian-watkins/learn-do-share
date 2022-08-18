import { rest, setupWorker, SetupWorkerApi } from "msw"
import { TestLearningArea } from "./fakes/learningArea"
import { TestUser } from "./fakes/user"
import { AppDisplay } from "@/display/display"
import display, { Model } from "@/src/engage/display"
import { engagementLevelsRetrieved } from "@/src/engage/engagementPlans"
import { DisplayElement, DisplayElementList, SelectorOptions } from "behaviors/helpers/displayElement"
import { Page } from "playwright"
import { Context } from "esbehavior"

export interface BackstageResponseOptions {
  delay: number
}

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
}

export class EngageTestContext {
  private user: TestUser | null = null
  private app: any = null
  public msw: SetupWorkerApi | null = null
  public handlers: Array<any> = []

  constructor(private area: TestLearningArea) {}

  async start(): Promise<void> {
    this.msw = setupWorker(...this.handlers)
    await this.msw.start({
      serviceWorker: {
        url: "/behaviors/unit/mockServiceWorker.js",
        options: {
          scope: "/"
        }
      },
      onUnhandledRequest: "bypass",
      quiet: !__IS_DEBUG__
    })

    this.app = new AppDisplay(display, this.getInitialState())
    this.app.mount("#test-app")
  }

  stop() {
    this.msw?.stop()
  }

  stubBackstageResponse(response: any, options: BackstageResponseOptions) {
    this.handlers.push(
      rest.post("/api/backstage", async (req, res, ctx) => {
        console.log("Got a request use!", await req.json())
        return res(
          ctx.status(200),
          ctx.json(response),
          ctx.delay(options.delay)
        )
      })
    )
  }

  withUser(user: TestUser): EngageTestContext {
    this.user = user
    return this
  }

  getInitialState(): Model {
    if (this.user !== null) {
      return {
        type: "personalized",
        learningArea: this.area,
        engagementLevels: engagementLevelsRetrieved([]),
        engagementNotes: [],
        user: this.user
      }
    } else {
      return {
        type: "informative",
        learningArea: this.area
      }
    }
  }
}
