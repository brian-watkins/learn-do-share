import { expect } from "chai";
import { behavior, condition, effect, example, pick, step } from "esbehavior";
import { Step } from "esbehavior/dist/Assumption";
import { FakeLearningArea, TestContext, testContext, TestLearningArea } from "./testApp";

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
          selectLearningArea(FakeLearningArea(1))
        ],
        observe: [
          effect("the content is displayed", async (testContext) => {
            const pageText = await testContext.display.pageText()
            expect(pageText).to.contain("Learn this stuff!")
          })
        ]
      }),
    example(testContext())
      .description("when learning area content contains markdown synatx")
      .script({
        prepare: [
          condition("the app loads", async (testContext) => {
            await testContext
              .withLearningAreas([
                FakeLearningArea(1).withContent(`
# This is my article

Here is an intro to what you will learn

### Further Reading
- One
- Here is a link to [somewhere](http://somewhere.com/somewhere.html).
- Three
                `)
              ])
              .start()
          })
        ],
        perform: [
          selectLearningArea(FakeLearningArea(1))
        ],
        observe: [
          effect("header content is displayed", async (testContext) => {
            const hasElement = await testContext.display.isVisible('h3:has-text("Further Reading")')
            expect(hasElement).to.be.true
          }),
          effect("links are displayed", async (testContext) => {
            const hasElement = await testContext.display.isVisible('a:has-text("somewhere")')
            expect(hasElement).to.be.true
          })
        ]
      })
  ])

function selectLearningArea(learningArea: TestLearningArea): Step<TestContext> {
  return step("a learning area is selected", async (testContext) => {
    await testContext.display.clickElementWithText(learningArea.title)
  })
}