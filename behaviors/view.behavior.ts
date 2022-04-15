import { behavior, condition, effect, example, pick } from "esbehavior"
import { expect } from "chai"
import { FakeLearningArea, testContext } from "./testApp"
import { learningAreas } from "./testDisplay"

export default
  behavior("viewing items", [
    example(testContext())
      .description("when there are no learning areas available")
      .script({
        prepare: [
          condition("the app loads", async (testContext) => {
            await testContext
              .withLearningAreas([])
              .start()
          })
        ],
        observe: [
          effect("it shows that there is nothing to learn", async (testContext) => {
            const text = await testContext.display.select(learningAreas()).text()
            expect(text).to.contain("There is nothing to learn!")
          })
        ]
      }),
    example(testContext())
      .description("when there are learning areas available")
      .script({
        prepare: [
          condition("the app loads and requests learning areas", async (testContext) =>
            await testContext
              .withLearningAreas([
                FakeLearningArea(1),
                FakeLearningArea(2),
                FakeLearningArea(3),
              ])
              .start()
          )
        ],
        observe: [
          effect("it does not show that there is nothing to learn", async (testContext) => {
            const text = await testContext.display.select(learningAreas()).text()
            expect(text).not.to.contain("There is nothing to learn!")
          }),
          effect("it shows that there are things to learn", async (testContext) => {
            const text = await testContext.display.select(learningAreas()).text()
            expect(text).to.contain(FakeLearningArea(1).title)
            expect(text).to.contain(FakeLearningArea(2).title)
            expect(text).to.contain(FakeLearningArea(3).title)
          })
        ]
      })
  ])