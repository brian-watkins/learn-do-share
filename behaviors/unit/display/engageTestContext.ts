import { TestLearningArea } from "./fakes/learningArea.js"
import { TestUser } from "./fakes/user.js"
import appDisplay from "@/src/engage/display.js"
import { EngagementLevel } from "@/src/engage/engagementPlans/index.js"
import { getServiceWorker } from "./mockServer.js"
import { DefaultBodyType, ResponseTransformer, rest, SetupWorker } from "msw"
import { TestEngagementNote } from "./fakes/note.js"
import { init } from "@/src/engage/storage.js"
import { Model } from "@/src/engage/model.js"
import { createDisplay } from "display-party"
import { Store } from "state-party"

export interface BackstageResponseOptions {
  status?: number
  delay?: number | "infinite",
  networkError?: boolean
}

export class EngageTestContext {
  private user: TestUser | null = null
  private notes: Array<TestEngagementNote> = []
  private engagementLevels: Array<EngagementLevel> = []
  private unmountApp: (() => void) | undefined
  public handlers: Array<any> = []
  private mockServiceWorker: SetupWorker | null = null

  constructor(private area: TestLearningArea) {}

  async start(): Promise<void> {
    this.mockServiceWorker = await getServiceWorker()
    this.mockServiceWorker.use(...this.handlers)

    const store = new Store()
    init(store, this.getInitialState())
    
    const view = appDisplay()
    const app = createDisplay(store)
    const mountPoint = document.createElement("div")
    mountPoint.id = "test-app"
    document.body.appendChild(mountPoint)
    this.unmountApp = app.mount(mountPoint, view)
  }

  stop() {
    this.unmountApp?.()
    this.mockServiceWorker?.resetHandlers()
  }

  stubBackstageResponse(response: any, options: BackstageResponseOptions) {
    this.handlers.push(
      rest.post("/api/backstage", async (_, res, ctx) => {
        if (options.networkError) {
          return res.networkError("Unable to connect!")
        }
        const transformers: Array<ResponseTransformer<DefaultBodyType, any>> = [
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
        engagementLevels: this.engagementLevels,
        engagementNotes: this.notes,
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
