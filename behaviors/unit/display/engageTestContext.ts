import { TestLearningArea } from "./fakes/learningArea"
import { TestUser } from "./fakes/user"
import { AppDisplay } from "@/display/display"
import display, { Model } from "@/src/engage/display"
import { engagementLevelsRetrieved } from "@/src/engage/engagementPlans"
import { getServiceWorker } from "./mockServer"
import { rest, SetupWorkerApi } from "msw"
import { TestEngagementNote } from "./fakes/note"
import { engagementNotesRetrieved } from "@/src/engage/engagementNotes"

export interface BackstageResponseOptions {
  status?: number
  delay?: number | "infinite",
  networkError?: boolean
}

export class EngageTestContext {
  private user: TestUser | null = null
  private notes: Array<TestEngagementNote> = []
  private app: any = null
  public handlers: Array<any> = []
  private mockServiceWorker: SetupWorkerApi | null = null

  constructor(private area: TestLearningArea) {}

  async start(): Promise<void> {
    this.mockServiceWorker = await getServiceWorker()
    this.mockServiceWorker.use(...this.handlers)

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

  getInitialState(): Model {
    if (this.user !== null) {
      return {
        type: "personalized",
        learningArea: this.area,
        engagementLevels: engagementLevelsRetrieved([]),
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
}
