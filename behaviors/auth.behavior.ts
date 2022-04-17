import { expect } from "chai";
import { behavior, condition, effect, example, pick, step } from "esbehavior";
import { loginUser, selectLearningArea } from "./steps";
import { FakeLearningArea, testContext } from "./testApp";

export default
  behavior("authentication", [
    example(testContext())
      .description("when not authenticated")
      .script({
        prepare: [
          condition("the app loads", async (testContext) => {
            await testContext
              .withLearningAreas([
                FakeLearningArea(1).withContent("Learn this stuff!")
              ])
              .start()
          })
        ],
        perform: [
          selectLearningArea(FakeLearningArea(1)),
        ],
        observe: [
          effect("no option is provided to select an engagement plan", async (testContext) => {
            const learningAreaText = await testContext.display
              .select('article', { withText: FakeLearningArea(1).title })
              .text()

            expect(learningAreaText).to.not.contain("I am learning it!")
            expect(learningAreaText).to.not.contain("I am doing it!")
            expect(learningAreaText).to.not.contain("I am sharing it!")
          })
        ]
      }),
    example(testContext())
      .description("when authentication is successful")
      .script({
        prepare: [
          condition("the app loads", async (testContext) => {
            await testContext
              .withLearningAreas([
                FakeLearningArea(1).withContent("Learn this stuff!")
              ])
              .start()
          })
        ],
        perform: [
          loginUser("fake-user@email.com")
        ],
        observe: [
          effect("authenticated user is identified", async (testContext) => {
            const userElementIsVisible = await testContext.display.selectElementWithText("fake-user@email.com").isVisible()
            expect(userElementIsVisible).to.be.true
          }),
          effect("login button is hidden", async (testContext) => {
            const loginIsHidden = await testContext.display.selectElementWithText("Login").isHidden()
            expect(loginIsHidden).to.be.true
          })
        ]
      })
  ])