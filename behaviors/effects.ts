import { expect } from "chai"
import { Effect, effect } from "esbehavior"
import { TestContext, TestLearningArea } from "./testApp"
import { engagementIndicatorView, learningAreaView } from "./testDisplay"

export function engagementLevelSelected(learningArea: TestLearningArea, indicator: string): Effect<TestContext> {
  return effect(`Engagement level '${indicator}' shown for Learning Area ${learningArea.testId}`, async (testContext) => {
    const engagementTexts = await testContext.display
      .select('article,section', { withText: learningArea.title })
      .selectAllDescendants(engagementIndicatorView())
      .mapElements(el => el.text())

    expect(engagementTexts).to.include(indicator)
  })
}

export function noEngagementLevelsSelected(learningArea: TestLearningArea): Effect<TestContext> {
  return effect(`No engagement shown for Learning Area ${learningArea.testId}`, async (testContext) => {
    const engagementLevelsHidden = await testContext.display
      .select('section', { withText: learningArea.title })
      .selectAllDescendants(engagementIndicatorView())
      .mapElements(element => element.isHidden())

    expect(engagementLevelsHidden).to.not.include(false, "Expected no engagement levels but found some")
  })
}

export interface LearningAreaDisplayOptions {
  withCategory: string
}

export function learningAreaDisplayed(learningArea: TestLearningArea, options: LearningAreaDisplayOptions): Effect<TestContext> {
  return effect(`Learning area '${learningArea.title}' is displayed in the ${options.withCategory} category`, async (testContext) => {
    const learningAreaText = await testContext.display
      .select(learningAreaView(learningArea.id))
      .text()
    
    expect(learningAreaText).to.contain(learningArea.title)
    expect(learningAreaText).to.contain(options.withCategory)
  })
}