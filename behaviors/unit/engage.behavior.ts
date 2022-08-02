import { behavior, Context, example, step, effect, fact } from "esbehavior"
import display, { Model } from "@/src/engage/display"
import { AppDisplay } from "@/display/display"
import { LearningAreaCategory } from "@/src/overview/learningAreaCategory"
import { LearningArea } from "@/src/engage/learningArea"
import { User } from "@/api/common/user"
import userEvent from "@testing-library/user-event"
import { UserEvent } from "@testing-library/user-event/dist/types/setup"
import { screen } from "@testing-library/dom"
import { rest, setupWorker, SetupWorkerApi } from "msw"
import { expect } from "chai"
import { engagementLevelsRetrieved } from "@/src/engage/personalizedLearningArea"


class TestLearningArea implements LearningArea {
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

function FakeLearningArea(testId: number): TestLearningArea {
  return new TestLearningArea(testId)
}

class TestUser implements User {
  constructor(public identifier: string, public name: string) { }
}

function FakeUser(email: string): TestUser {
  return new TestUser("test-id", email)
}

class EngageTestContext {
  private user: TestUser | null = null
  private app: any = null
  private actor: UserEvent
  public msw: SetupWorkerApi | null = null
  public handlers: Array<any> = []

  constructor(private area: TestLearningArea) {
    this.actor = userEvent.setup()
  }

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
      quiet: true
    })

    this.actor = userEvent.setup()

    this.app = new AppDisplay(display, this.getInitialState())
    this.app.mount("#test-app")
  }

  clickElementWithText(text: string): Promise<void> {
    const element = screen.getByRole('button', { name: text })
    return this.actor?.click(element)
  }

  withUser(user: TestUser): EngageTestContext {
    this.user = user
    return this
  }

  getInitialState(): Model {
    if (this.user !== null) {
      return {
        type: "personalized",
        learningArea: { ...this.area, engagementLevels: engagementLevelsRetrieved([]), engagementNotes: [] },
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

function learningAreaTestContext(area: TestLearningArea): Context<EngageTestContext> {
  return {
    init: () => { return new EngageTestContext(area) },
    teardown: (testContext) => {
      testContext.msw?.stop()
    }
  }
}

export default
  behavior("indicate engagement with a learning area", [
    example(learningAreaTestContext(FakeLearningArea(1)))
      .description("when an engagement level is being saved")
      .script({
        suppose: [
          fact("requests to backstage are delayed", (testContext) => {
            testContext.handlers.push(
              rest.post("/api/backstage", async (req, res, ctx) => {
                console.log("Got a request use!", await req.json())
                return res(
                  ctx.status(200),
                  ctx.json({
                    type: "engagementPlanPersisted",
                    plan: {
                      level: "learning"
                    }
                  }),
                  ctx.delay(5 * 1000)
                )
              })
            )
          }),
          fact("someone is logged in", (testContext) => {
            testContext.withUser(FakeUser("fun-person@email.com"))
          })
        ],
        perform: [
          step("visit the learning area page", async (testContext) => {
            await testContext.start()
          }),
          step("click the increase engagement button", async (testContext) => {
            await testContext.clickElementWithText("I'm ready to learn!")
          }),
        ],
        observe: [
          effect("the increase engagement button is disabled", async () => {
            const button = await screen.findByText("I'm ready to learn!")
            expect(button.hasAttribute("disabled")).to.be.true
          })
        ]
      })
  ])