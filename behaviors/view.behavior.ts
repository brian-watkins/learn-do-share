import { behavior, condition, effect, example, pick, step } from "esbehavior"
import { expect } from "chai"
import { FakeLearningArea, testContext } from "./testApp"

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
            const pageText = await testContext.display.pageText()
            expect(pageText).to.contain("There is nothing to learn!")
          })
        ]
      }),
    example(testContext())
      .description("when there are learning areas available")
      .script({
        prepare: [
          condition("the app loads and requests learning areas", async (testContext) =>
            await testContext
              .start()
          )
        ],
        observe: [
          effect("it shows a loading indicator", async (testContext) => {
            const loadingIndicatorIsVisible = await testContext.display.isVisible("#loading-indicator")
            expect(loadingIndicatorIsVisible).to.be.true
          })
        ]
      }).andThen({
        perform: [
          step("the learning areas are returned", (testContext) => {
            testContext.resolveLearningAreasRequestWith([
              FakeLearningArea(1),
              FakeLearningArea(2),
              FakeLearningArea(3),
            ])
          })
        ],
        observe: [
          effect("it hides the loading indicator", async (testContext) => {
            const loadingIndicatorIsVisible = await testContext.display.isVisible("#loading-indicator")
            expect(loadingIndicatorIsVisible).to.be.false
          }),
          effect("it does not show that there is nothing to learn", async (testContext) => {
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