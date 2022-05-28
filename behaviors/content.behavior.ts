import { expect } from "chai";
import { behavior, condition, effect, example } from "esbehavior";
import { LearningAreaCategory } from "@/src/overview/learningAreaCategory";
import { gotoLearningAreas, loginUser, selectLearningArea } from "./steps";
import { FakeLearningArea, testContext } from "./testApp";
import { EngagementLevel } from "@/src/engage/engagementPlans";
import { contentAreaView, engagementLevelSelected, learningAreaSummaryDisplayed, selectedLearningAreaCategoryDisplayed, selectedLearningAreaContentDisplayed, selectedLearningAreaTitleDisplayed } from "./effects";

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
          learningAreaSummaryDisplayed(awesomeLearningArea, { withCategory: "Team" }),
          learningAreaSummaryDisplayed(superLearningArea, { withCategory: "Discipline" }),
          learningAreaSummaryDisplayed(coolLearningArea, { withCategory: "Theory" })
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
          selectedLearningAreaTitleDisplayed("Super Learning Area"),
          selectedLearningAreaContentDisplayed("Learn this stuff!"),
          selectedLearningAreaCategoryDisplayed("Discipline")
        ]
      }).andThen({
        perform: [
          gotoLearningAreas()
        ],
        observe: [
          learningAreaSummaryDisplayed(awesomeLearningArea, { withCategory: "Team" }),
          learningAreaSummaryDisplayed(superLearningArea, { withCategory: "Discipline" }),
          learningAreaSummaryDisplayed(coolLearningArea, { withCategory: "Theory" })
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
          selectedLearningAreaTitleDisplayed("Awesome Learning Area"),
          selectedLearningAreaContentDisplayed("Learn this stuff!"),
          selectedLearningAreaCategoryDisplayed("Team"),
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
          selectedLearningAreaCategoryDisplayed("Theory"),
          selectedLearningAreaTitleDisplayed("Cool Learning Area"),
          selectedLearningAreaContentDisplayed(coolLearningArea.content),
          engagementLevelSelected(coolLearningArea, "Learning"),
          engagementLevelSelected(coolLearningArea, "Doing"),
        ]
      }).andThen({
        perform: [
          gotoLearningAreas()
        ],
        observe: [
          learningAreaSummaryDisplayed(coolLearningArea, { withCategory: "Theory" }),
          learningAreaSummaryDisplayed(superLearningArea, { withCategory: "Discipline" })
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
            const actualTexts = await testContext.display.selectAll(contentAreaView("a")).mapElements((el) => el.text())
            expect(actualTexts).to.deep.equal(["somewhere", "another link"])
          }),
          effect("links should open in a different tab", async (testContext) => {
            const actualTargets = await testContext.display.selectAll(contentAreaView("a")).mapElements(el => el.getAttribute("target"))
            expect(actualTargets).to.deep.equal(["_blank", "_blank"])
          }),
          effect("links should describe the proper relationship", async (testContext) => {
            const actualTargets = await testContext.display.selectAll(contentAreaView("a")).mapElements(el => el.getAttribute("rel"))
            expect(actualTargets).to.deep.equal(["external", "external"])
          })
        ]
      })
  ])

