import { behavior, example, effect, Observation, Presupposition, fact } from "esbehavior"
import { FakeLearningArea } from "./fakes/learningArea.js"
import { expect } from "chai"
import { EngageTestContext, learningAreaTestContext } from "./engageTestContext.js"
import { backstageRequestsAreDelayed, backstageRequestsFailDueToNetworkError, backstageRequestsFailDueToServerError, someoneIsAuthenticated } from "./presuppositions.js"
import { userClicksIncreaseEngagementButton, visitTheLearningAreaPage, waitForResponseFromBackstage } from "./steps.js"
import { EngagementLevel } from "@/src/engage/engagementPlans/index.js"
import { errorMessageIsVisible } from "./observations.js"

export default
  behavior("indicate engagement with a learning area", [
    example(learningAreaTestContext(FakeLearningArea(1)))
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
    example(learningAreaTestContext(FakeLearningArea(1)))
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
    example(learningAreaTestContext(FakeLearningArea(1)))
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
    example(learningAreaTestContext(FakeLearningArea(1)))
      .description("when the engagement plan request results in network error")
      .script({
        suppose: [
          backstageRequestsFailDueToNetworkError(),
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
    example(learningAreaTestContext(FakeLearningArea(1)))
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
    example(learningAreaTestContext(FakeLearningArea(1)))
      .description("when the engagement level reset fails due to a network error")
      .script({
        suppose: [
          backstageRequestsFailDueToNetworkError(),
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
      })
  ])

function increaseEngagementButtonIsDisabled(isDisabled: boolean): Observation<EngageTestContext> {
  return effect(`the increase engagement button is ${isDisabled ? "disabled" : "enabled"}`, async (testContext) => {
    const disabledValue = await testContext.select("[data-increase-engagement]")
      .isDisabled()
    expect(disabledValue).to.equal(isDisabled)
  })
}

function userIsMaximallyEngaged(): Presupposition<EngageTestContext> {
  return fact("user is maximally engaged", (testContext) => {
    testContext.withEngagementLevels([
      EngagementLevel.Learning,
      EngagementLevel.Doing,
      EngagementLevel.Sharing
    ])
  })
}