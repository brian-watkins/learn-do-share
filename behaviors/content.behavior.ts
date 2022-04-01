import { expect } from "chai";
import { behavior, condition, effect, example, pick, step } from "esbehavior";
import { FakeLearningArea, testContext } from "./testApp";

export default
  behavior("viewing learning area content", [
    example(testContext())
      .description("when a learning area is viewed")
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
          step("a learning area is selected", async (testContext) => {
            await testContext.display.clickElementWithText(FakeLearningArea(1).title)
          })
        ],
        observe: [
          effect("the content is displayed", async (testContext) => {
            const pageText = await testContext.display.pageText()
            expect(pageText).to.contain("Learn this stuff!")
          })
        ]
      })
  ])