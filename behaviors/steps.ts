import { step } from "esbehavior"
import { Step } from "esbehavior/dist/Assumption"
import { userIdentifierFor } from "./helpers"
import { TestContext, TestLearningArea } from "./testApp"

export function reloadTheApp(): Step<TestContext> {
  return step("Reload the app", async (testContext) => {
    await testContext.reload()
  })
}

export function reloadThePage(): Step<TestContext> {
  return step("Reload the page", async (testContext) => {
    await testContext.reloadPage()
  })
}

export function goBackToLearningAreas(): Step<TestContext> {
  return step("Return to the learning areas list", async (testContext) => {
    await testContext.display.goBack()
  })
}

export function gotoLearningAreas(): Step<TestContext> {
  return step("Link to view learning areas is clicked", async (testContext) => {
    await testContext.display.selectElementWithText("All Learning Areas").click()
  })
}

export function selectLearningArea(learningArea: TestLearningArea): Step<TestContext> {
  return step(`Selected Learning Area ${learningArea.testId}`, async (testContext) => {
    await testContext.display.selectElementWithText(learningArea.title).click()
  })
}

export function loginUser(username: string): Step<TestContext> {
  return step(`login ${username}`, async (testContext) => {
    await testContext.display.selectElementWithText("Login").click()
    await testContext.display.select("#userId").type(userIdentifierFor(username), { clear: true })
    await testContext.display.select("#userDetails").type(username)
    await testContext.display.select("#submit").click()
    await testContext.display.selectElementWithText(username).isVisible()
  })
}
