import { behavior, example, step, effect, fact } from "esbehavior"
import { FakeLearningArea } from "./fakes/learningArea"
import { FakeUser } from "./fakes/user"
import { Page } from "playwright"
import { expect } from "chai"
import { learningAreaTestContext } from "./engageTestContext"


export default (page: Page) =>
  behavior("indicate engagement with a learning area", [
    example(learningAreaTestContext(page, FakeLearningArea(1)))
      .description("when an engagement level is being saved")
      .script({
        suppose: [
          fact("requests to backstage are delayed", async (testContext) => {
            await testContext.stubBackstageResponse({
              type: "engagementPlanPersisted",
              plan: {
                level: "learning"
              }
            }, { delay: 5 * 1000 })
          }),
          fact("someone is logged in", async (testContext) => {
            await testContext.withUser(FakeUser("fun-person@email.com"))
          })
        ],
        perform: [
          step("visit the learning area page", async (testContext) => {
            await testContext.start()
          }),
          step("click the increase engagement button", async (testContext) => {
            await testContext.selectElementWithText("I'm ready to learn!")
              .click()
          }),
        ],
        observe: [
          effect("the increase engagement button is disabled", async (testContext) => {
            const disabledValue = await testContext.selectElementWithText("I'm ready to learn!")
              .getAttribute("disabled")
            expect(disabledValue).to.equal("true")
          })
        ]
      })
  ])