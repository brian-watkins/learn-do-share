import { step } from "esbehavior"
import { Step } from "esbehavior/dist/Assumption"
import { TestContext, TestLearningArea } from "./testApp"

export function reloadTheApp(): Step<TestContext> {
  return step("Reload the app", async (testContext) => {
    await testContext.reload()
  })
}

export function returnToLearningAreas(): Step<TestContext> {
  return step("Return to the learning areas list", async (testContext) => {
    await testContext.display.goBack()
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
    await testContext.display.select("#userId").type(userIdentifier(username), { clear: true })
    await testContext.display.select("#userDetails").type(username)
    await testContext.display.select("#submit").click()
    await testContext.display.selectElementWithText(username).isVisible()
  })
}

function userIdentifier(name: string): string {
  let buff = Buffer.from(name);
  return buff.toString('base64')
}