import { behavior, example, effect, Observation } from "esbehavior"
import { FakeLearningArea } from "./fakes/learningArea"
import { Page } from "playwright"
import { expect } from "chai"
import { EngageTestContextProxy, learningAreaTestContext } from "./engageTestContextProxy"
import { backstageRequestsAreDelayed, backstageRequestsFailDueToNetworkError, backstageRequestsFailDueToServerError, someoneIsAuthenticated } from "./presuppositions"
import { userClicksIncreaseEngagementButton, visitTheLearningAreaPage, waitForResponseFromBackstage } from "./steps"

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
      .description("when a request to backstage results in a server error")
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
      .description("when a request to backstage results in network error")
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
      })
  ])

function increaseEngagementButtonIsDisabled(isDisabled: boolean): Observation<EngageTestContextProxy> {
  return effect(`the increase engagement button is ${isDisabled ? "disabled" : "enabled"}`, async (testContext) => {
    const disabledValue = await testContext.selectElementWithText("I'm ready to learn!")
      .isDisabled()
    expect(disabledValue).to.equal(isDisabled)
  })
}