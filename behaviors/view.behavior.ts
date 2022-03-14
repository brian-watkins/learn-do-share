import { behavior, condition, effect, example, pick } from "esbehavior"
import { expect } from "chai"
import { FakeLearningArea, testContext } from "./testApp"

export default
  behavior("viewing items", [
    example(testContext())
      .description("when there are no learning areas available")
      .script({
        prepare: [
          condition("the app loads", async (testContext) => testContext.start())
        ],
        observe: [
          effect("it shows that there is nothing to learn", async (testContext) => {
            const pageText = await testContext.display.pageText()
            expect(pageText).to.contain("There is nothing to learn!")
          })
        ]
      }),
    example(testContext())
      .description("when there are learning areas available")
      .script({
        prepare: [
          condition("the app loads with learning areas", async (testContext) =>
            testContext
              .withLearningAreas([
                FakeLearningArea(1),
                FakeLearningArea(2),
                FakeLearningArea(3),
              ])
              .start()
          ),
        ],
        observe: [
          effect("it no longer shows that there is nothing to learn", async (testContext) => {
            const pageText = await testContext.display.pageText()
            expect(pageText).not.to.contain("There is nothing to learn!")
          }),
          effect("it shows that there are things to learn", async (testContext) => {
            const pageText = await testContext.display.pageText()
            expect(pageText).to.contain(FakeLearningArea(1).title)
            expect(pageText).to.contain(FakeLearningArea(2).title)
            expect(pageText).to.contain(FakeLearningArea(3).title)
          })
        ]
      })
  ])