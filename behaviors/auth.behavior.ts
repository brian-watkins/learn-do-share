import { expect } from "chai";
import { behavior, condition, effect, example, pick, step } from "esbehavior";
import { learningAreaDisplayed } from "./effects";
import { loginUser, selectLearningArea } from "./steps";
import { FakeLearningArea, testContext } from "./testApp";

export default
  behavior("authentication", [
    example(testContext())
      .description("when not authenticated")
      .script({
        prepare: [
          condition("the app loads", async (testContext) => {
            await testContext
              .withLearningAreas([
                // FakeLearningArea(1).withContent("Learn this stuff!")
                FakeLearningArea(1),
                FakeLearningArea(2)
              ])
              .start()
          })
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
          effect("login button is visible", async (testContext) => {
            const loginIsVisible = await testContext.display.selectElementWithText("Login").isVisible()
            expect(loginIsVisible).to.be.true
          })
        ]
      }).andThen({
        perform:[
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
          // effect("the engagement page is still displayed and an engagement plan can be selected", async (testContext) => {
          //   const learningAreaText = await testContext.display
          //     .select('article', { withText: FakeLearningArea(1).title })
          //     .text()

          //   expect(learningAreaText).to.contain("I am learning it!")
          // })
        ]
      }),
    example(testContext())
      .description("when authentication is successful from the overview page")
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
          })
        ]
      }),
    // example(testContext())
    //   .description("when not authenticated on the engage page")
    //   .script({
    //     prepare: [
    //       // Should probably abstract this somehow
    //       condition("the app loads the page for a learning area", async (testContext) => {
    //         await testContext
    //           .withLearningAreas([
    //             FakeLearningArea(1)
    //           ])
    //           .start(`/learning-areas/${FakeLearningArea(1).id}`)
    //       })
    //     ],
    //     observe: [

    //     ]
    //   })
  ])