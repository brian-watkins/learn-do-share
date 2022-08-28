import { TestLearningArea } from "./fakes/learningArea"
import { TestUser } from "./fakes/user"
import { AppDisplay } from "@/display/display"
import display, { Model } from "@/src/engage/display"
import { EngagementLevel, engagementLevelsRetrieved } from "@/src/engage/engagementPlans"
import { getServiceWorker } from "./mockServer"
import { rest, SetupWorkerApi } from "msw"
import { TestEngagementNote } from "./fakes/note"
import { Context } from "esbehavior"
import { TestingLibraryDisplayElement, TestingLibraryDisplayElementList } from "./testingLibraryDisplayElement"
import { DisplayElement, DisplayElementList, SelectorOptions } from "behaviors/helpers/displayElement"
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup"
import userEvent from "@testing-library/user-event"
import { engagementNotesRetrieved } from "@/src/engage/engagementNotes"

export function learningAreaTestContext(area: TestLearningArea): Context<EngageTestContext> {
  return {
    init: () => {
      return new EngageTestContext(area)
    },
    teardown: (testContext) => {
      return testContext.stop()
    }
  }
}

export interface BackstageResponseOptions {
  status?: number
  delay?: number | "infinite",
  networkError?: boolean
}

export class EngageTestContext {
  private user: TestUser | null = null
  private notes: Array<TestEngagementNote> = []
  private engagementLevels: Array<EngagementLevel> = []
  private app: any = null
  public handlers: Array<any> = []
  private mockServiceWorker: SetupWorkerApi | null = null
  private actor: UserEvent | null = null
  attributes: { [key:string]: any } = {}

  constructor(private area: TestLearningArea) {}

  async start(): Promise<void> {
    this.mockServiceWorker = await getServiceWorker()
    this.mockServiceWorker.use(...this.handlers)

    this.actor = userEvent.setup()

    this.app = new AppDisplay(display, this.getInitialState())
    this.app.mount("#test-app")
  }

  stop() {
    this.app.destroy()
    this.mockServiceWorker?.resetHandlers()
  }

  stubBackstageResponse(response: any, options: BackstageResponseOptions) {
    this.handlers.push(
      rest.post("/api/backstage", async (_, res, ctx) => {
        if (options.networkError) {
          return res.networkError("Unable to connect!")
        }
        const transformers = [
          ctx.status(options.status ?? 200),
          ctx.json(response)
        ]
        if (options.delay) {
          transformers.push(ctx.delay(options.delay))
        }
        return res(...transformers)
      })
    )
  }

  withUser(user: TestUser): EngageTestContext {
    this.user = user
    return this
  }

  withNotes(notes: Array<TestEngagementNote>): EngageTestContext {
    this.notes = notes
    return this
  }

  withEngagementLevels(levels: Array<EngagementLevel>): EngageTestContext {
    this.engagementLevels = levels
    return this
  }

  getInitialState(): Model {
    if (this.user !== null) {
      return {
        type: "personalized",
        learningArea: this.area,
        engagementLevels: engagementLevelsRetrieved(this.engagementLevels),
        engagementNotes: engagementNotesRetrieved(this.notes),
        user: this.user
      }
    } else {
      return {
        type: "informative",
        learningArea: this.area
      }
    }
  }

  selectElementWithText(text: string): DisplayElement {
    return TestingLibraryDisplayElement.withText(this.actor!, text)
  }

  select(selector: string, options: SelectorOptions = {}): DisplayElement {
    return TestingLibraryDisplayElement.fromSelector(this.actor!, selector, options)
  }

  selectAll(selector: string): DisplayElementList {
    return TestingLibraryDisplayElementList.fromSelector(this.actor!, selector)
  }

  waitForRequestsToComplete(): Promise<void> {
    return new Promise((resolve) => { setTimeout(resolve, 10) })
  }
}
