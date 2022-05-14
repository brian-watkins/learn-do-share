import { expect } from "chai";
import { behavior, condition, effect, example, pick, step } from "esbehavior";
import { LearningAreaCategory } from "../src/overview/learningAreaCategory";
import { selectLearningArea } from "./steps";
import { FakeLearningArea, testContext } from "./testApp";
import { contentArea, title } from "./testDisplay";

export default
  behavior("viewing learning area content", [
    example(testContext())
      .description("when the url for a learning area is visited")
      .script({
        prepare: [
          condition("the app loads the page for a learning area", async (testContext) => {
            await testContext
              .withLearningAreas([
                FakeLearningArea(1)
                  .withCategory(LearningAreaCategory.Discipline)
                  .withContent("Learn this stuff!")
              ])
              .start(`/learning-areas/${FakeLearningArea(1).id}`)
          })
        ],
        observe: [
          // This could probably be abstracted as a behavior observation or something
          // since we use it in the next example
          effect("the title is displayed", async (testContext) => {
            const titleText = await testContext.display.select(title()).text()
            expect(titleText).to.contain(FakeLearningArea(1).title)
          }),
          effect("the content is displayed", async (testContext) => {
            const contentText = await testContext.display.select(contentArea()).text()
            expect(contentText).to.contain("Learn this stuff!")
          }),
          effect("the learning area category is displayed", async (testContext) => {
            const categoryText = await testContext.display.select("#learning-area-category").text()
            expect(categoryText).to.contain("Discipline")
          })
        ]
      }),
    example(testContext())
      .description("when a learning area is selected")
      .script({
        prepare: [
          condition("the app loads", async (testContext) => {
            await testContext
              .withLearningAreas([
                FakeLearningArea(1)
                  .withCategory(LearningAreaCategory.Discipline)
                  .withContent("Learn this stuff!")
              ])
              .start()
          })
        ],
        perform: [
          selectLearningArea(FakeLearningArea(1))
        ],
        observe: [
          effect("the content is displayed", async (testContext) => {
            const contentText = await testContext.display.select(contentArea()).text()
            expect(contentText).to.contain("Learn this stuff!")
          }),
          effect("the learning area category is displayed", async (testContext) => {
            const categoryText = await testContext.display.select("#learning-area-category").text()
            expect(categoryText).to.contain("Discipline")
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
- Here is [another link](http://anotherplace.com)
                `)
              ])
              .start()
          })
        ],
        perform: [
          selectLearningArea(FakeLearningArea(1))
        ],
        observe: [
          effect("header content is displayed as header", async (testContext) => {
            const actualTag = await testContext.display.selectElementWithText("Further Reading").tagName()
            expect(actualTag).to.equal("H3")
          }),
          effect("links are displayed", async (testContext) => {
            const actualTexts = await testContext.display.selectAll(contentArea("a")).mapElements((el) => el.text())
            expect(actualTexts).to.deep.equal(["somewhere", "another link"])
          }),
          effect("links should open in a different tab", async (testContext) => {
            const actualTargets = await testContext.display.selectAll(contentArea("a")).mapElements(el => el.getAttribute("target"))
            expect(actualTargets).to.deep.equal(["_blank", "_blank"])
          }),
          effect("links should describe the proper relationship", async (testContext) => {
            const actualTargets = await testContext.display.selectAll(contentArea("a")).mapElements(el => el.getAttribute("rel"))
            expect(actualTargets).to.deep.equal(["external", "external"])
          })
        ]
      })
  ])
