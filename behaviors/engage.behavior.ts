import { expect } from "chai";
import { behavior, condition, Effect, effect, example, pick, step } from "esbehavior";
import { Step } from "esbehavior/dist/Assumption";
import { loginUser, selectLearningArea } from "./steps";
import { FakeLearningArea, TestContext, testContext, TestLearningArea } from "./testApp";

export default
  behavior("indicate engagement with a learning area", [
    example(testContext())
      .description("selecting engagement levels")
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
          selectEngagementLevel(FakeLearningArea(1), "I am learning it!"),
          selectLearningArea(FakeLearningArea(2)),
          selectEngagementLevel(FakeLearningArea(2), "I am doing it!"),
          selectLearningArea(FakeLearningArea(4)),
          selectEngagementLevel(FakeLearningArea(4), "I am sharing it!")
        ],
        observe: [
          engagementLevelSelected(FakeLearningArea(1), "Learning"),
          engagementLevelSelected(FakeLearningArea(2), "Doing"),
          engagementLevelSelected(FakeLearningArea(4), "Sharing"),
        ]
      })
      .andThen({
        perform: [
          step("Reload the app", async (testContext) => {
            await testContext.reload()
          }),
          loginUser("funny-person@email.com")
        ],
        observe: [
          engagementLevelSelected(FakeLearningArea(1), "Learning"),
          engagementLevelSelected(FakeLearningArea(2), "Doing"),
          engagementLevelSelected(FakeLearningArea(4), "Sharing"),
        ]
      })
  ])

function selectEngagementLevel(learningArea: TestLearningArea, description: string): Step<TestContext> {
  return step(`Selected '${description}' for ${learningArea.title}`, async (testContext) => {
    await testContext.display
      .select("article", { withText: learningArea.title })
      .selectDescendantWithText(description)
      .click()
  })
}

function engagementLevelSelected(learningArea: TestLearningArea, indicator: string): Effect<TestContext> {
  return effect(`Engagement level '${indicator}' shown for Learning Area ${learningArea.testId}`, async (testContext) => {
    const engagementText = await testContext.display
      .select('article', { withText: learningArea.title })
      .selectDescendant('[data-engagement-indicator]')
      .text()

    expect(engagementText).to.contain(indicator)
  })
}