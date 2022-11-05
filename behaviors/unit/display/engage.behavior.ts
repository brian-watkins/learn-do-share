import { behavior, example, effect, Observation, fact, Presupposition } from "esbehavior"
import { FakeLearningArea } from "./fakes/learningArea"
import { Page } from "playwright"
import { expect } from "chai"
import { EngageTestContextProxy, learningAreaTestContext } from "./engageTestContextProxy"
import { backstageRequestsAreDelayed, backstageRequestsFailDueToNetworkError, backstageRequestsFailDueToServerError, someoneIsAuthenticated } from "./presuppositions"
import { userClicksIncreaseEngagementButton, visitTheLearningAreaPage, waitForResponseFromBackstage } from "./steps"
import { EngagementLevel } from "@/src/engage/engagementPlans"
import { errorMessageIsVisible } from "./observations"

export default (page: Page) =>
  behavior("indicate engagement with a learning area", [
    example(learningAreaTestContext(page, FakeLearningArea(1)))
      .description("when an engagement level is being saved")
      .script({
        suppose: [
          backstageRequestsAreDelayed(),
          someoneIsAuthenticated("fun-person@email.com")
        ],
        perform: [
          visitTheLearningAreaPage(),
          userClicksIncreaseEngagementButton()
        ],
        observe: [
          increaseEngagementButtonIsDisabled(true)
        ]
      }),
    example(learningAreaTestContext(page, FakeLearningArea(1)))
      .description("when the engagement levels are reset")
      .script({
        suppose: [
          backstageRequestsAreDelayed(),
          someoneIsAuthenticated("fun-dude@email.com"),
          userIsMaximallyEngaged()
        ],
        perform: [
          visitTheLearningAreaPage(),
          userClicksIncreaseEngagementButton()
        ],
        observe: [
          increaseEngagementButtonIsDisabled(true)
        ]
      }),
    example(learningAreaTestContext(page, FakeLearningArea(1)))
      .description("when the engagement plan request results in a server error")
      .script({
        suppose: [
          backstageRequestsFailDueToServerError(),
          someoneIsAuthenticated("fun-person@email.com")
        ],
        perform: [
          visitTheLearningAreaPage(),
          userClicksIncreaseEngagementButton(),
          waitForResponseFromBackstage()
        ],
        observe: [
          increaseEngagementButtonIsDisabled(false)
        ]
      }),
    example(learningAreaTestContext(page, FakeLearningArea(1)))
      .description("when the engagement plan request results in network error")
      .script({
        suppose: [
          backstageRequestsFailDueToNetworkError(),
          someoneIsAuthenticated("fun-person@email.com")
        ],
        perform: [
          visitTheLearningAreaPage(),
          userClicksIncreaseEngagementButton()
        ],
        observe: [
          increaseEngagementButtonIsDisabled(false)
        ]
      }),
    example(learningAreaTestContext(page, FakeLearningArea(1)))
      .description("when the engagement level reset fails due to a server error")
      .script({
        suppose: [
          backstageRequestsFailDueToServerError(),
          someoneIsAuthenticated("fun-dude@email.com"),
          userIsMaximallyEngaged()
        ],
        perform: [
          visitTheLearningAreaPage(),
          userClicksIncreaseEngagementButton(),
          waitForResponseFromBackstage()
        ],
        observe: [
          increaseEngagementButtonIsDisabled(false),
          errorMessageIsVisible(true)
        ]
      }),
    example(learningAreaTestContext(page, FakeLearningArea(1)))
      .description("when the engagement level reset fails due to a network error")
      .script({
        suppose: [
          backstageRequestsFailDueToNetworkError(),
          someoneIsAuthenticated("fun-dude@email.com"),
          userIsMaximallyEngaged()
        ],
        perform: [
          visitTheLearningAreaPage(),
          userClicksIncreaseEngagementButton()
        ],
        observe: [
          increaseEngagementButtonIsDisabled(false),
          errorMessageIsVisible(true)
        ]
      })
  ])

function increaseEngagementButtonIsDisabled(isDisabled: boolean): Observation<EngageTestContextProxy> {
  return effect(`the increase engagement button is ${isDisabled ? "disabled" : "enabled"}`, async (testContext) => {
    const disabledValue = await testContext.select("[data-increase-engagement]")
      .isDisabled()
    expect(disabledValue).to.equal(isDisabled)
  })
}

function userIsMaximallyEngaged(): Presupposition<EngageTestContextProxy> {
  return fact("user is maximally engaged", async (testContext) => {
    await testContext.withEngagementLevels([
      EngagementLevel.Learning,
      EngagementLevel.Doing,
      EngagementLevel.Sharing
    ])
  })
}