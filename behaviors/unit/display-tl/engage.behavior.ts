import { behavior, example, effect, Observation, pick } from "esbehavior"
import { FakeLearningArea } from "./fakes/learningArea"
import { expect } from "chai"
import { EngageTestContext, learningAreaTestContext } from "./engageTestContext"
import { backstageRequestsAreDelayed, backstageRequestsFailDueToNetworkError, backstageRequestsFailDueToServerError, someoneIsAuthenticated } from "./presuppositions"
import { userClicksIncreaseEngagementButton, visitTheLearningAreaPage, waitForResponseFromBackstage } from "./steps"

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
      })
  ])

function increaseEngagementButtonIsDisabled(isDisabled: boolean): Observation<EngageTestContext> {
  return effect(`the increase engagement button is ${isDisabled ? "disabled" : "enabled"}`, async (testContext) => {
    const disabledValue = await testContext.selectElementWithText("I'm ready to learn!")
      .isDisabled()
    expect(disabledValue).to.equal(isDisabled)
  })
}