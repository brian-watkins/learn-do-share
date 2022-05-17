import { expect } from "chai";
import { behavior, condition, effect, example, pick, skip, step } from "esbehavior";
import { LearningAreaCategory } from "@/src/overview/learningAreaCategory";
import { gotoLearningAreas, loginUser, selectLearningArea } from "./steps";
import { FakeLearningArea, TestContext, testContext } from "./testApp";
import { contentArea, disciplineLearningAreas, teamLearningAreas, theoryLearningAreas, title } from "./testDisplay";
import { EngagementLevel } from "@/src/engage/engagementPlans";
import { Step } from "esbehavior/dist/Assumption";
import { engagementLevelSelected, learningAreaDisplayed } from "./effects";

const coolLearningArea =
  FakeLearningArea(1)
    .withTitle("Cool Learning Area")
    .withCategory(LearningAreaCategory.Theory)

const superLearningArea =
  FakeLearningArea(2)
    .withTitle("Super Learning Area")
    .withCategory(LearningAreaCategory.Discipline)
    .withContent("Learn this stuff!")

const awesomeLearningArea =
  FakeLearningArea(3)
    .withTitle("Awesome Learning Area")
    .withCategory(LearningAreaCategory.Team)
    .withContent("Learn this stuff!")


export default
  behavior("viewing learning area content", [
    example(testContext())
      .description("when the url for an unknown learning area is visited")
      .script({
        prepare: [
          condition("the app loads the page for a learning area", async (testContext) => {
            await testContext
              .withLearningAreas([
                coolLearningArea,
                awesomeLearningArea,
                superLearningArea
              ])
              .start(`/learning-areas/some-unknown-id`)
          })
        ],
        observe: [
          effect("it loads the main page instead", async (testContext) => {
            expect(testContext.display.path()).to.equal("/index.html")
          }),
          learningAreaDisplayed(awesomeLearningArea, { in: teamLearningAreas() }),
          learningAreaDisplayed(superLearningArea, { in: disciplineLearningAreas() }),
          learningAreaDisplayed(coolLearningArea, { in: theoryLearningAreas() })
        ]
      }),
    example(testContext())
      .description("when the url for a learning area is visited")
      .script({
        prepare: [
          condition("the app loads the page for a learning area", async (testContext) => {
            await testContext
              .withLearningAreas([
                coolLearningArea,
                awesomeLearningArea,
                superLearningArea
              ])
              .start(`/learning-areas/${superLearningArea.id}`)
          })
        ],
        observe: [
          titleDisplayed("Super Learning Area"),
          contentDisplayed("Learn this stuff!"),
          categoryDisplayed("Discipline")
        ]
      }).andThen({
        perform: [
          gotoLearningAreas()
        ],
        observe: [
          learningAreaDisplayed(awesomeLearningArea, { in: teamLearningAreas() }),
          learningAreaDisplayed(superLearningArea, { in: disciplineLearningAreas() }),
          learningAreaDisplayed(coolLearningArea, { in: theoryLearningAreas() })
        ]
      }),
    example(testContext())
      .description("when a learning area is selected")
      .script({
        prepare: [
          condition("the app loads", async (testContext) => {
            await testContext
              .withLearningAreas([
                awesomeLearningArea
              ])
              .start()
          })
        ],
        perform: [
          selectLearningArea(awesomeLearningArea)
        ],
        observe: [
          titleDisplayed("Awesome Learning Area"),
          contentDisplayed("Learn this stuff!"),
          categoryDisplayed("Team"),
        ]
      }),
    example(testContext())
      .description("when a logged in user selects a learning area that they are learning and doing")
      .script({
        prepare: [
          condition("the app loads", async (testContext) => {
            await testContext
              .withLearningAreas([
                coolLearningArea,
                superLearningArea
              ])
              .withEngagementPlan("fun-user@email.com", coolLearningArea, EngagementLevel.Learning)
              .withEngagementPlan("fun-user@email.com", coolLearningArea, EngagementLevel.Doing)
              .start()
          })
        ],
        perform: [
          loginUser("fun-user@email.com"),
          selectLearningArea(coolLearningArea)
        ],
        observe: [
          categoryDisplayed("Theory"),
          titleDisplayed("Cool Learning Area"),
          contentDisplayed(coolLearningArea.content),
          engagementLevelSelected(coolLearningArea, "Learning"),
          engagementLevelSelected(coolLearningArea, "Doing"),
        ]
      }).andThen({
        perform: [
          gotoLearningAreas()
        ],
        observe: [
          learningAreaDisplayed(coolLearningArea, { in: theoryLearningAreas() }),
          learningAreaDisplayed(superLearningArea, { in: disciplineLearningAreas() })
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

function titleDisplayed(expected: string): Step<TestContext> {
  return effect("the title is displayed", async (testContext) => {
    const titleText = await testContext.display.select(title()).text()
    expect(titleText).to.contain(expected)
  })
}

function contentDisplayed(expected: string): Step<TestContext> {
  return effect("the content is displayed", async (testContext) => {
    const contentText = await testContext.display.select(contentArea()).text()
    expect(contentText).to.contain(expected)
  })
}

function categoryDisplayed(expected: string): Step<TestContext> {
  return effect("the learning area category is displayed", async (testContext) => {
    const categoryText = await testContext.display.select("#learning-area-category").text()
    expect(categoryText).to.contain(expected)
  })
}
