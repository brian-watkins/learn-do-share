import { behavior, example, step, effect, fact, pick } from "esbehavior"
import { FakeLearningArea } from "./fakes/learningArea"
import { FakeUser } from "./fakes/user"
import { Page } from "playwright"
import { expect } from "chai"
import { learningAreaTestContext } from "./engageTestContextProxy"

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
            }, { delay: "infinite" })
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
              .isDisabled()
            expect(disabledValue).to.equal(true)
          })
        ]
      }),
    example(learningAreaTestContext(page, FakeLearningArea(1)))
      .description("when a request to backstage results in a 500 response")
      .script({
        suppose: [
          fact("requests to backstage fail with 500 response", async (testContext) => {
            await testContext.stubBackstageResponse("", { status: 500 })
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
            await testContext.waitForRequestsToComplete()
          }),
        ],
        observe: [
          effect("the increase engagement button is enabled", async (testContext) => {
            const disabledValue = await testContext.selectElementWithText("I'm ready to learn!")
              .isDisabled()
            expect(disabledValue).to.equal(false)
          })
        ]
      })
  ])
