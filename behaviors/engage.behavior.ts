import { expect } from "chai";
import { behavior, condition, Effect, effect, example, pick, step } from "esbehavior";
import { Step } from "esbehavior/dist/Assumption";
import { loginUser, reloadTheApp, returnToLearningAreas, selectLearningArea } from "./steps";
import { FakeLearningArea, TestContext, testContext, TestLearningArea } from "./testApp";

export default
  behavior("indicate engagement with a learning area", [
    pick.example(testContext())
      .description("engagement levels are persisted for a particular user")
      .script({
        prepare: [
          condition("The app loads", async (testContext) => {
            await testContext
              .withLearningAreas([
                FakeLearningArea(1),
                FakeLearningArea(2),
                FakeLearningArea(3),
                FakeLearningArea(4),
              ])
              .start()
          })
        ],
        perform: [
          loginUser("funny-person@email.com"),
          selectLearningArea(FakeLearningArea(1)),
          increaseEngagementLevel(FakeLearningArea(1), "I'm ready to learn!"),
          returnToLearningAreas(),
          selectLearningArea(FakeLearningArea(2)),
          increaseEngagementLevel(FakeLearningArea(2), "I'm ready to learn!"),
          increaseEngagementLevel(FakeLearningArea(2), "Let's do it!"),
          returnToLearningAreas(),
          selectLearningArea(FakeLearningArea(4)),
          increaseEngagementLevel(FakeLearningArea(4), "I'm ready to learn!"),
          increaseEngagementLevel(FakeLearningArea(4), "Let's do it!"),
          increaseEngagementLevel(FakeLearningArea(4), "I'm ready to share!"),
          returnToLearningAreas()
        ],
        observe: [
          engagementLevelSelected(FakeLearningArea(1), "Learning"),
          engagementLevelSelected(FakeLearningArea(2), "Learning"),
          engagementLevelSelected(FakeLearningArea(2), "Doing"),
          engagementLevelSelected(FakeLearningArea(4), "Learning"),
          engagementLevelSelected(FakeLearningArea(4), "Doing"),
          engagementLevelSelected(FakeLearningArea(4), "Sharing"),
        ]
      })
      .andThen({
        perform: [
          reloadTheApp(),
          loginUser("funny-person@email.com")
        ],
        observe: [
          engagementLevelSelected(FakeLearningArea(1), "Learning"),
          engagementLevelSelected(FakeLearningArea(2), "Learning"),
          engagementLevelSelected(FakeLearningArea(2), "Doing"),
          engagementLevelSelected(FakeLearningArea(4), "Learning"),
          engagementLevelSelected(FakeLearningArea(4), "Doing"),
          engagementLevelSelected(FakeLearningArea(4), "Sharing"),
        ]
      }).andThen({
        perform: [
          reloadTheApp(),
          loginUser("some-other-user@email.com")
        ],
        observe: [
          noEngagementLevelsSelected(FakeLearningArea(1)),
          noEngagementLevelsSelected(FakeLearningArea(2)),
          noEngagementLevelsSelected(FakeLearningArea(4)),
        ]
      }),
    example(testContext())
      .description("clear engagement levels")
      .script({
        prepare: [
          condition("The app loads", async (testContext) => {
            await testContext
              .withLearningAreas([
                FakeLearningArea(1)
              ])
              .start()
          })
        ],
        perform: [
          loginUser("funny-person@email.com"),
          selectLearningArea(FakeLearningArea(1)),
          increaseEngagementLevel(FakeLearningArea(1), "I'm ready to learn!"),
        ],
        observe: [
          engagementLevelSelected(FakeLearningArea(1), "Learning")
        ]
      }).andThen({
        perform: [
          increaseEngagementLevel(FakeLearningArea(1), "Let's do it!")
        ],
        observe: [
          engagementLevelSelected(FakeLearningArea(1), "Learning"),
          engagementLevelSelected(FakeLearningArea(1), "Doing")
        ]
      }).andThen({
        perform: [
          increaseEngagementLevel(FakeLearningArea(1), "I'm ready to share!")
        ],
        observe: [
          engagementLevelSelected(FakeLearningArea(1), "Learning"),
          engagementLevelSelected(FakeLearningArea(1), "Doing"),
          engagementLevelSelected(FakeLearningArea(1), "Sharing")
        ]
      }).andThen({
        perform: [
          increaseEngagementLevel(FakeLearningArea(1), "I'm done for now!"),
        ],
        observe: [
          noEngagementLevelsSelected(FakeLearningArea(1))
        ]
      }).andThen({
        perform: [
          reloadTheApp(),
          loginUser("funny-person@email.com")
        ],
        observe: [
          noEngagementLevelsSelected(FakeLearningArea(1))
        ]
      })
  ])

function increaseEngagementLevel(learningArea: TestLearningArea, engagementLevelButton: string): Step<TestContext> {
  return step(`Clicked '${engagementLevelButton}' for ${learningArea.title}`, async (testContext) => {
    await testContext.display
      .select("article", { withText: learningArea.title })
      .selectDescendantWithText(engagementLevelButton)
      .click()
  })
}

function engagementLevelSelected(learningArea: TestLearningArea, indicator: string): Effect<TestContext> {
  return effect(`Engagement level '${indicator}' shown for Learning Area ${learningArea.testId}`, async (testContext) => {
    const engagementTextIsVisible = await testContext.display
      .select('article', { withText: learningArea.title })
      .selectDescendant('[data-engagement-indicator]', { withText: indicator })
      .isVisible()

    expect(engagementTextIsVisible).to.be.true
  })
}

function noEngagementLevelsSelected(learningArea: TestLearningArea): Effect<TestContext> {
  return effect(`No engagement shown for Learning Area ${learningArea.testId}`, async (testContext) => {
    const engagementLevelsHidden = await testContext.display
      .select('article', { withText: learningArea.title })
      .selectAllDescendants('[data-engagement-indicator]')
      .mapElements(element => element.isHidden())
    
    expect(engagementLevelsHidden).to.not.include(false, "Expected no engagement levels but found some")
  })
}