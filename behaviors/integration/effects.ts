import { expect } from "chai"
import { effect, Observation } from "esbehavior"
import { TestContext, TestLearningArea } from "./testApp.js"

export function engagementLevelSelected(learningArea: TestLearningArea, indicator: string): Observation<TestContext> {
  return effect(`Engagement level '${indicator}' shown for Learning Area ${learningArea.testId}`, async (testContext) => {
    const engagementTexts = await testContext.display
      .select('article,section', { withText: learningArea.title })
      .selectAllDescendants(engagementIndicatorView())
      .mapElements(el => el.text())

    expect(engagementTexts).to.include(indicator)
  })
}

export function noEngagementLevelsSelected(learningArea: TestLearningArea): Observation<TestContext> {
  return effect(`No engagement shown for Learning Area ${learningArea.testId}`, async (testContext) => {
    const engagementLevelsHidden = await testContext.display
      .select('section', { withText: learningArea.title })
      .selectAllDescendants(engagementIndicatorView())
      .mapElements(element => element.isHidden())

    expect(engagementLevelsHidden).to.not.include(false, "Expected no engagement levels but found some")
  })
}

export function engagementIndicatorView() {
  return '[data-engagement-indicator]'
}

export interface LearningAreaDisplayOptions {
  withCategory: string | null
}

export function learningAreaSummaryDisplayed(learningArea: TestLearningArea, options: LearningAreaDisplayOptions = { withCategory: null }): Observation<TestContext> {
  let title = `Learning area '${learningArea.title}' summary is displayed`
  if (options.withCategory) {
    title += ` in the ${options.withCategory} category`
  }
  
  return effect(title, async (testContext) => {
    const learningAreaText = await testContext.display
      .select(learningAreaView(learningArea.id))
      .text()
    
    expect(learningAreaText).to.contain(learningArea.title)
    if (options.withCategory) {
      expect(learningAreaText).to.contain(options.withCategory)
    }
  })
}

export function learningAreaView(id: string) {
  return `[data-learning-area="${id}"]`
}

export function selectedLearningAreaTitleDisplayed(expected: string): Observation<TestContext> {
  return effect("the learning area title is displayed", async (testContext) => {
    const titleText = await testContext.display.select(titleView()).text()
    expect(titleText).to.contain(expected)
  })
}

export function selectedLearningAreaContentDisplayed(expected: string): Observation<TestContext> {
  return effect("the learning area content is displayed", async (testContext) => {
    const contentText = await testContext.display.select(contentAreaView()).text()
    expect(contentText).to.contain(expected)
  })
}

export function selectedLearningAreaCategoryDisplayed(expected: string): Observation<TestContext> {
  return effect("the learning area category is displayed", async (testContext) => {
    const categoryText = await testContext.display.select(categoryView()).text()
    expect(categoryText).to.contain(expected)
  })
}

export function titleView() {
  return "#learning-area-title"
}

export function contentAreaView(selector: string = "") {
  return `#learning-area-content ${selector}`
}

export function categoryView() {
  return "#learning-area-category"
}

export function notesView() {
  return "[data-engagement-note]"
}

export function noteInputView() {
  return "[data-note-input]"
}