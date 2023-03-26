import { Action, step } from "esbehavior"
import { userIdentifierFor } from "./helpers.js"
import { TestContext, TestLearningArea } from "./testApp.js"

export function visitTheLearningAreas(): Action<TestContext> {
  return step("visit the list of learning areas", async (testContext) => {
    await testContext.start()
  })
}

export function visitTheLearningArea(learningArea: TestLearningArea): Action<TestContext> {
  return step(`visit ${learningArea.title}`, async (testContext) => {
    await testContext.startAtLearningArea(learningArea)
  })
}

export function reloadTheApp(): Action<TestContext> {
  return step("Reload the app", async (testContext) => {
    await testContext.reload()
  })
}

export function reloadThePage(): Action<TestContext> {
  return step("Reload the list of learning areas", async (testContext) => {
    await testContext.reloadPage()
  })
}

export function goBackToLearningAreas(): Action<TestContext> {
  return step("Return to the learning areas list", async (testContext) => {
    await testContext.display.goBack()
  })
}

export function gotoLearningAreas(): Action<TestContext> {
  return step("Link to view learning areas is clicked", async (testContext) => {
    await testContext.display.selectElementWithText("All Learning Areas").click()
    await testContext.display.waitForPageLoad()
  })
}

export function selectLearningArea(learningArea: TestLearningArea): Action<TestContext> {
  return step(`Selected '${learningArea.title}'`, async (testContext) => {
    await testContext.display.selectElementWithText(learningArea.title).click()
    await testContext.display.waitForPageLoad()
  })
}

export function loginUser(username: string): Action<TestContext> {
  return step(`login ${username}`, async (testContext) => {
    await testContext.display.selectElementWithText("Login").click()
    await testContext.display.select("#userId").type(userIdentifierFor(username), { clear: true })
    await testContext.display.select("#userDetails").type(username)
    await testContext.display.select("#submit").click()
    await testContext.display.selectElementWithText(username).isVisible()
  })
}
