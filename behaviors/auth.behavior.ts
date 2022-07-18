import { expect } from "chai";
import { behavior, effect, example, fact, outcome, pick } from "esbehavior";
import { learningAreaSummaryDisplayed, selectedLearningAreaTitleDisplayed } from "./effects";
import { loginUser, selectLearningArea, visitTheLearningAreas } from "./actions";
import { FakeLearningArea, testContext } from "./testApp";
import { thereAreLearningAreas } from "./presuppositions";

export default
  behavior("authentication", [
    example(testContext())
      .description("when not authenticated")
      .script({
        suppose: [
          thereAreLearningAreas([ FakeLearningArea(1), FakeLearningArea(2) ])
        ],
        perform: [
          visitTheLearningAreas()
        ],
        observe: [
          effect("login button is visible", async (testContext) => {
            const loginIsVisible = await testContext.display.selectElementWithText("Login").isVisible()
            expect(loginIsVisible).to.be.true
          })
        ]
      }).andThen({
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
          }),
          effect("the notes area is not shown", async (testContext) => {
            const notesAreHidden = await testContext.display
              .select("#engagement-notes")
              .isHidden()

            expect(notesAreHidden).to.be.true
          }),
          effect("login button is visible", async (testContext) => {
            const loginIsVisible = await testContext.display.selectElementWithText("Login").isVisible()
            expect(loginIsVisible).to.be.true
          })
        ]
      }).andThen({
        perform: [
          loginUser("cool-user@email.com")
        ],
        observe: [
          effect("authenticated user is identified", async (testContext) => {
            const userElementIsVisible = await testContext.display.selectElementWithText("cool-user@email.com").isVisible()
            expect(userElementIsVisible).to.be.true
          }),
          effect("login button is hidden", async (testContext) => {
            const loginIsHidden = await testContext.display.selectElementWithText("Login").isHidden()
            expect(loginIsHidden).to.be.true
          }),
          selectedLearningAreaTitleDisplayed(FakeLearningArea(1).title),
          effect("an engagement plan can be selected", async (testContext) => {
            const learningAreaText = await testContext.display
              .select('article', { withText: FakeLearningArea(1).title })
              .text()

            expect(learningAreaText).to.contain("I'm ready to learn!")
          }),
          effect("the notes area is shown", async (testContext) => {
            const notesAreVisible = await testContext.display
              .select("#engagement-notes")
              .isVisible()

            expect(notesAreVisible).to.be.true
          })
        ]
      }),
    example(testContext())
      .description("when authentication is successful from the overview page")
      .script({
        suppose: [
          thereAreLearningAreas([ FakeLearningArea(1), FakeLearningArea(2) ])
        ],
        perform: [
          visitTheLearningAreas(),
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
          }),
          outcome("the list of learning areas is displayed", [
            learningAreaSummaryDisplayed(FakeLearningArea(1)),
            learningAreaSummaryDisplayed(FakeLearningArea(2))
          ])
        ]
      })
  ])