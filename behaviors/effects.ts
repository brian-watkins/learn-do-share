import { expect } from "chai"
import { Effect, effect } from "esbehavior"
import { TestContext, TestLearningArea } from "./testApp"

export function engagementLevelSelected(learningArea: TestLearningArea, indicator: string): Effect<TestContext> {
  return effect(`Engagement level '${indicator}' shown for Learning Area ${learningArea.testId}`, async (testContext) => {
    const engagementTexts = await testContext.display
      .select('article', { withText: learningArea.title })
      .selectAllDescendants('[data-engagement-indicator]')
      .mapElements(el => el.text())

    expect(engagementTexts).to.include(indicator)
  })
}

export function noEngagementLevelsSelected(learningArea: TestLearningArea): Effect<TestContext> {
  return effect(`No engagement shown for Learning Area ${learningArea.testId}`, async (testContext) => {
    const engagementLevelsHidden = await testContext.display
      .select('article', { withText: learningArea.title })
      .selectAllDescendants('[data-engagement-indicator]')
      .mapElements(element => element.isHidden())

    expect(engagementLevelsHidden).to.not.include(false, "Expected no engagement levels but found some")
  })
}