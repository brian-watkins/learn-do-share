import { step } from "esbehavior"
import { Step } from "esbehavior/dist/Assumption"
import { TestContext, TestLearningArea } from "./testApp"

export function selectLearningArea(learningArea: TestLearningArea): Step<TestContext> {
  return step(`Selected Learning Area ${learningArea.testId}`, async (testContext) => {
    await testContext.display.selectElementWithText(learningArea.title).click()
  })
}