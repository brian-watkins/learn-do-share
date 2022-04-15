import { expect } from "chai";
import { behavior, condition, effect, example, pick, step } from "esbehavior";
import { FakeLearningArea, testContext } from "./testApp";

export default
behavior("authentication", [
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
        step("login", async (testContext) => {
          await testContext.display.selectElementWithText("Login").click()
          await testContext.display.select("#userDetails").type("fake-user@email.com")
          await testContext.display.select("#submit").click()
        })
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